"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emitFirstSessionCompleted, emitPracticeDrillStarted } from "@/lib/analytics";
import { getUser } from "@/lib/auth";
import { validateAnswer } from "@/lib/interview/answer";
import { analyzeAnswer } from "@/lib/interview/challenge";
import {
  countFollowUps,
  FOLLOW_UP_CAP,
  nextInterviewerAction,
} from "@/lib/interview/interviewer";
import {
  countCompletedSessions,
  getInterviewSessionForUser,
  markSessionComplete,
  recordAnswer,
  recordFollowUp,
} from "@/lib/interview/repository";

import type { SubmitAnswerState } from "./types";

function toRubric(rubric: unknown): string[] {
  return Array.isArray(rubric)
    ? rubric.filter((item): item is string => typeof item === "string")
    : [];
}

/**
 * Persists a candidate's answer (spoken or typed) against the active question
 * and revalidates the room so the transcript timeline reflects it.
 */
export async function submitAnswerAction(
  _prev: SubmitAnswerState,
  formData: FormData,
): Promise<SubmitAnswerState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };

  const sessionId = String(formData.get("sessionId") ?? "");
  const questionId = String(formData.get("questionId") ?? "");
  if (!sessionId || !questionId) {
    return { error: "Missing session context. Reload and try again." };
  }

  const validation = validateAnswer({
    transcript: String(formData.get("transcript") ?? ""),
    durationSeconds: Number(formData.get("durationSeconds") ?? 0),
  });
  if (!validation.ok) return { error: validation.error };

  const turn = await recordAnswer({
    userId: user.id,
    sessionId,
    questionId,
    transcript: validation.transcript,
    durationSeconds: validation.durationSeconds,
  });
  if (!turn) return { error: "Could not save your answer. Please try again." };

  const session = await getInterviewSessionForUser(user.id, sessionId);
  const question = session?.questions.find((q) => q.id === questionId);

  // Adaptive follow-up: if the answer is vague/unsupported and the per-question
  // cap isn't reached, challenge instead of advancing. A failed analysis must
  // not block the session — fall through to normal progression.
  if (session && question && countFollowUps(session.turns, questionId) < FOLLOW_UP_CAP) {
    try {
      const analysis = await analyzeAnswer({
        questionText: question.questionText,
        objective: question.objective,
        targetClaim: question.targetClaim,
        requiredEvidence: toRubric(question.rubric),
        answer: validation.transcript,
      });
      if (analysis.shouldChallenge) {
        await recordFollowUp({
          userId: user.id,
          sessionId,
          questionId,
          question: analysis.followUpQuestion,
          challenge: {
            reason: analysis.reason,
            weakSpan: analysis.weakSpan,
            challengedClaim: analysis.challengedClaim,
            improvementChips: analysis.improvementChips,
          },
        });
        revalidatePath(`/interview/${sessionId}`);
        return { ok: true };
      }
    } catch {
      // Challenge analysis unavailable — keep the session moving.
    }
  }

  // No follow-up: after the fifth primary question resolves, finish the session
  // and hand off to the session-complete bridge.
  if (session && nextInterviewerAction(session).type === "complete") {
    await markSessionComplete(user.id, sessionId);
    const completedSessionCount = await countCompletedSessions(user.id);
    await emitFirstSessionCompleted({
      userId: user.id,
      sessionId,
      completedSessionCount,
    });
    redirect(`/interview/${sessionId}/complete`);
  }

  revalidatePath(`/interview/${sessionId}`);
  return { ok: true };
}

/** Records the practice-drill signal, then sends the user into a new setup. */
export async function startPracticeDrillAction(formData: FormData) {
  const user = await getUser();
  if (user) {
    const sessionId = String(formData.get("sessionId") ?? "") || undefined;
    await emitPracticeDrillStarted({ userId: user.id, sessionId });
  }
  redirect("/setup");
}
