import { notFound } from "next/navigation";

import { emitReportViewed } from "@/lib/analytics";
import { getUser } from "@/lib/auth";
import { getFeedbackReport } from "@/lib/interview/report-repository";
import { CoachingReportSchema } from "@/lib/interview/report";
import { getSessionForReport } from "@/lib/interview/repository";

import { startPracticeDrillAction } from "../actions";
import { generateReportAction, markImprovedAnswerReadAction } from "./actions";
import { ReportView } from "./report-view";

/**
 * The coaching report for a session. If no report exists yet, the view offers
 * to generate it (with in-progress/failure recovery); once persisted, it
 * renders readiness and the coaching sections. The full Stitch report screen is
 * built out in #20.
 */
export default async function CoachingReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const user = await getUser();
  if (!user) notFound();

  const session = await getSessionForReport(user.id, sessionId);
  if (!session) notFound();

  const existing = await getFeedbackReport(user.id, sessionId);
  const parsed = existing
    ? CoachingReportSchema.safeParse(existing.reportJson)
    : null;

  // Success signal: the user is viewing a generated report.
  if (parsed?.success) {
    await emitReportViewed({ userId: user.id, sessionId });
  }

  return (
    <ReportView
      report={parsed?.success ? parsed.data : null}
      sessionId={sessionId}
      meta={{
        roleTitle: session.targetRole.title,
        completedAtISO: (session.completedAt ?? session.createdAt).toISOString(),
      }}
      generateAction={generateReportAction}
      drillAction={startPracticeDrillAction}
      improvedReadAction={markImprovedAnswerReadAction}
    />
  );
}
