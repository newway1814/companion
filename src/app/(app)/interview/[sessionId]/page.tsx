import { notFound } from "next/navigation";

import { getUser } from "@/lib/auth";
import { getInterviewSessionForUser } from "@/lib/interview/repository";

/**
 * Minimal interview room entry. The full speech-first workspace
 * (`pages/main_interview_room/`) is a separate issue; this confirms the planned
 * session opens for its owner and surfaces the first persisted question.
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

  const [firstQuestion] = session.questions;

  return (
    <div className="mx-auto max-w-3xl p-gutter">
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Question 1 of {session.questions.length}
      </p>
      <h1 className="mt-2 font-heading text-display-md text-on-surface">
        {firstQuestion?.questionText ?? "Your practice session is ready."}
      </h1>
      {firstQuestion ? (
        <p className="mt-3 max-w-prose text-body-lg text-on-surface-variant">
          {firstQuestion.objective}
        </p>
      ) : null}
    </div>
  );
}
