import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import type { CoachingReport } from "./report";

/**
 * Persists (or replaces) a session's coaching report, scoped to the session
 * owner. Readiness band/score are flattened into columns for cheap querying;
 * the full report lives in `reportJson`. Returns null if the session isn't the
 * user's.
 */
export async function saveFeedbackReport(
  userId: string,
  sessionId: string,
  report: CoachingReport,
) {
  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true },
  });
  if (!session) return null;

  const data = {
    readinessBand: report.readiness.band,
    readinessScore: report.readiness.score,
    reportJson: report as unknown as Prisma.InputJsonValue,
  };

  return prisma.feedbackReport.upsert({
    where: { sessionId },
    create: { sessionId, ...data },
    update: data,
  });
}

/** Reads a session's report, scoped to the owner via the session relation. */
export function getFeedbackReport(userId: string, sessionId: string) {
  return prisma.feedbackReport.findFirst({
    where: { sessionId, session: { userId } },
  });
}
