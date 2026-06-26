import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

/**
 * Minimal session-complete bridge. The full completion summary and "View
 * coaching report" hand-off (`pages/session_complete/`) is issue #18; this
 * confirms the five-question run finished and gives a way back.
 */
export default async function SessionCompletePage({
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

  const answered = session.turns.filter(
    (turn) => turn.kind === "ANSWER" && turn.speaker === "CANDIDATE",
  ).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-gutter py-16 text-center">
      <CircleCheck className="size-10 text-primary" aria-hidden="true" />
      <h1 className="font-heading text-display-md text-on-surface">
        Session complete
      </h1>
      <p className="max-w-prose text-body-lg text-on-surface-variant">
        You answered {answered} of {session.questions.length} questions in your
        project deep-dive. Your coaching report is coming next.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center justify-center rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
