import { notFound, redirect } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

import { submitAnswerAction } from "./actions";
import { InterviewRoom } from "./interview-room";
import { buildRoomView } from "./room-view";

/**
 * Interview room entry. Loads the persisted session (scoped to its owner) and
 * renders the desktop three-area workspace with the transcript timeline and the
 * speech-first answer composer. The evidence/notes panel is a later slice.
 */
export default async function InterviewRoomPage({
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

  // A finished session belongs on the completion bridge, not the live room.
  if (session.status === "COMPLETED") {
    redirect(`/interview/${sessionId}/complete`);
  }

  const view = buildRoomView(session);

  return (
    <InterviewRoom
      view={view}
      sessionId={sessionId}
      submitAction={submitAnswerAction}
    />
  );
}
