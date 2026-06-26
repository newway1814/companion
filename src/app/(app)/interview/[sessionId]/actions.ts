"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth";
import { validateAnswer } from "@/lib/interview/answer";
import { recordAnswer } from "@/lib/interview/repository";

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

  revalidatePath(`/interview/${sessionId}`);
  return { ok: true };
}
