import { Timer, User } from "lucide-react";

import { AnswerComposer } from "./answer-composer";
import type { InterviewRoomView } from "./room-view";
import { TranscriptTimeline } from "./transcript-timeline";
import type { SubmitAnswerAction } from "./types";

export function InterviewRoom({
  view,
  sessionId,
  submitAction,
}: {
  view: InterviewRoomView;
  sessionId: string;
  submitAction: SubmitAnswerAction;
}) {
  return (
    <div className="flex h-full min-h-full flex-col bg-surface-dim/40">
      {/* Session chrome */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-outline-variant bg-surface/80 px-gutter backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="font-heading text-section-title font-semibold text-primary">
            Companion
          </span>
          <span className="h-6 w-px bg-outline-variant" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="font-heading text-section-title text-on-surface">
              Session: {view.sessionType}
            </span>
            <span className="rounded bg-surface-variant px-2 py-1 font-mono text-mono-label text-on-surface-variant">
              Question {view.currentIndex + 1} of {view.totalQuestions}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full border border-primary-container bg-primary-container/10 px-3 py-1.5 text-label-caps font-bold uppercase tracking-wide text-primary-container">
            <span
              className="size-2 rounded-full bg-primary-container"
              aria-hidden="true"
            />
            {view.statusLabel}
          </span>
          <span className="flex items-center gap-2 rounded border border-outline-variant bg-surface px-3 py-1.5 font-mono text-mono-label text-on-surface-variant">
            <Timer className="size-4" aria-hidden="true" />
            {view.timingLabel}
          </span>
        </div>
      </header>

      {/* Three-area workspace */}
      <main className="mx-auto flex w-full max-w-container-max flex-1 overflow-hidden">
        {/* Left: interviewer presence + transcript timeline */}
        <section
          aria-label="Interviewer"
          className="flex w-1/3 min-w-[320px] max-w-[480px] flex-col border-r border-outline-variant bg-surface-container-lowest"
        >
          <div className="border-b border-outline-variant p-gutter">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-surface-variant text-primary">
                <User className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-section-title text-on-surface">
                  Interviewer
                </h2>
                <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
                  {view.interviewerRole}
                </p>
              </div>
            </div>
            {view.currentQuestion ? (
              <div className="relative rounded border border-outline-variant bg-surface p-4">
                <span
                  className="absolute inset-y-0 left-0 w-1 rounded-l bg-primary-container"
                  aria-hidden="true"
                />
                <p className="ml-2 text-body-lg leading-relaxed text-on-surface">
                  {view.currentQuestion.text}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-auto">
            <TranscriptTimeline items={view.timeline} />
          </div>
        </section>

        {/* Center: answer composer */}
        <section
          aria-label="Your answer"
          className="flex flex-1 flex-col p-gutter"
        >
          {view.currentQuestion ? (
            <AnswerComposer
              key={view.currentQuestion.id}
              sessionId={sessionId}
              questionId={view.currentQuestion.id}
              submitAction={submitAction}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center">
              <p className="max-w-prose text-body-md text-on-surface-variant">
                This session has no questions to answer.
              </p>
            </div>
          )}
        </section>

        {/* Right: evidence + interviewer notes (a later slice) */}
        <aside
          aria-label="Evidence and notes"
          className="flex w-[360px] flex-col border-l border-outline-variant bg-surface-container-lowest p-gutter"
        >
          <h2 className="mb-2 flex items-center gap-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
            Evidence and notes
          </h2>
          <p className="text-body-md text-on-surface-variant">
            The target claim, required evidence, and interviewer notes appear
            here as the session runs.
          </p>
        </aside>
      </main>
    </div>
  );
}
