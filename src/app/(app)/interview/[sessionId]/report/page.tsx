import Link from "next/link";
import { notFound } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

/**
 * Minimal coaching-report entry. The full report — readiness, technical depth,
 * claim-defense vulnerabilities, and improved-answer reframing
 * (`pages/final_coaching_report/`) — is built in #19 (scoring) and #20 (report
 * screen). This confirms the report opens for the completed session.
 */
export default async function CoachingReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const user = await getUser();
  const session = user
    ? await getInterviewSessionForUser(user.id, sessionId)
    : null;

  if (!session) notFound();

  return (
    <div className="mx-auto max-w-3xl p-gutter py-12">
      <h1 className="font-heading text-display-md text-on-surface">
        Coaching report
      </h1>
      <p className="mt-3 max-w-prose text-body-lg text-on-surface-variant">
        Your readiness, technical depth, and claim-defense feedback for this
        session are coming next.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest px-6 py-3 text-body-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
