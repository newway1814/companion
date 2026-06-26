"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth";
import { validateAnswer } from "@/lib/interview/answer";
import { nextInterviewerAction } from "@/lib/interview/interviewer";
import {
  getInterviewSessionForUser,
  markSessionComplete,
  recordAnswer,
} from "@/lib/interview/repository";

import type { SubmitAnswerState } from "./types";

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

  // After the fifth primary question resolves, finish the session and hand off
  // to the session-complete bridge.
  const session = await getInterviewSessionForUser(user.id, sessionId);
  if (session && nextInterviewerAction(session).type === "complete") {
    await markSessionComplete(user.id, sessionId);
    redirect(`/interview/${sessionId}/complete`);
  }

  revalidatePath(`/interview/${sessionId}`);
  return { ok: true };
}
