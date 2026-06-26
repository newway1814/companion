import { notFound } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

import { InterviewRoom } from "./interview-room";
import { buildRoomView } from "./room-view";

/**
 * Interview room shell entry. Loads the persisted session (scoped to its owner)
 * and renders the desktop three-area workspace. The transcript, answer composer,
 * and evidence panels are later slices; this delivers the layout and the
 * static-per-session chrome.
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

  const view = buildRoomView(session);

  return <InterviewRoom view={view} />;
}
