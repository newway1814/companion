import { notFound } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getFeedbackReport } from "@/lib/interview/report-repository";
import { CoachingReportSchema } from "@/lib/interview/report";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

import { generateReportAction } from "./actions";
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

  const session = await getInterviewSessionForUser(user.id, sessionId);
  if (!session) notFound();

  const existing = await getFeedbackReport(user.id, sessionId);
  const parsed = existing
    ? CoachingReportSchema.safeParse(existing.reportJson)
    : null;

  return (
    <ReportView
      report={parsed?.success ? parsed.data : null}
      sessionId={sessionId}
      generateAction={generateReportAction}
    />
  );
}
