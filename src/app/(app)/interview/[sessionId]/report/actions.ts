"use server";

import { revalidatePath } from "next/cache";

import { emitImprovedAnswerRead } from "@/lib/analytics";
import { AiSafetyError } from "@/lib/ai/gateway";
import { getUser } from "@/lib/auth";
import { generateCoachingReport, buildReportContext } from "@/lib/interview/report";
import { saveFeedbackReport } from "@/lib/interview/report-repository";
import { getSessionForReport } from "@/lib/interview/repository";

import type { GenerateReportState } from "./types";

/** Records that the user read an improved-answer reframing (a success signal). */
export async function markImprovedAnswerReadAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const sessionId = String(formData.get("sessionId") ?? "");
  if (sessionId) {
    await emitImprovedAnswerRead({ userId: user.id, sessionId });
  }
}

/**
 * Generates and persists the coaching report for a completed session. Scoped to
 * the owner; surfaces a recoverable error rather than throwing so the report
 * screen can offer a retry.
 */
export async function generateReportAction(
  _prev: GenerateReportState,
  formData: FormData,
): Promise<GenerateReportState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };

  const sessionId = String(formData.get("sessionId") ?? "");
  const session = sessionId ? await getSessionForReport(user.id, sessionId) : null;
  if (!session) return { error: "Session not found." };
  if (session.status !== "COMPLETED") {
    return { error: "Finish the session before generating a report." };
  }

  try {
    const context = buildReportContext({
      targetRole: session.targetRole.title,
      questions: session.questions,
      turns: session.turns,
    });
    const report = await generateCoachingReport(context);
    await saveFeedbackReport(user.id, sessionId, report);
  } catch (error) {
    if (error instanceof AiSafetyError) {
      return { error: "The report was blocked by a safety check. Please try again." };
    }
    return { error: "Could not build your report. Please try again." };
  }

  revalidatePath(`/interview/${sessionId}/report`);
  return { ok: true };
}
