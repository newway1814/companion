import { notFound, redirect } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

import { SessionComplete } from "./session-complete";
import { buildCompletionSummary } from "./summary";

/**
 * The session-complete bridge (`pages/session_complete/`). Shows the completion
 * summary and the hand-off into the coaching report once the five-question run
 * finishes. A still-running session is sent back to the room.
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
  if (session.status !== "COMPLETED") redirect(`/interview/${sessionId}`);

  const summary = buildCompletionSummary(session);

  return <SessionComplete sessionId={sessionId} summary={summary} />;
}
