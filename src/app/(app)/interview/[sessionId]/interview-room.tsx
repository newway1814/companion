import { Check, Timer, User } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import type { InterviewRoomView, RoomQuestionState } from "./room-view";

function TimelineMarker({
  state,
  position,
}: {
  state: RoomQuestionState;
  position: number;
}) {
  if (state === "done") {
    return (
      <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
        <Check className="size-3.5" aria-hidden="true" />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary font-mono text-mono-label text-on-primary">
        {position}
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex size-6 items-center justify-center rounded-full border border-outline-variant font-mono text-mono-label text-on-surface-variant">
      {position}
    </span>
  );
}

export function InterviewRoom({ view }: { view: InterviewRoomView }) {
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

          <section
            aria-label="Transcript timeline"
            className="mt-auto border-t border-outline-variant bg-surface-bright p-gutter"
          >
            <h3 className="mb-4 text-label-caps uppercase tracking-wide text-on-surface-variant">
              Transcript timeline
            </h3>
            <ol className="flex flex-col gap-3">
              {view.timeline.map((item, index) => (
                <li
                  key={item.orderIndex}
                  className={cn(
                    "flex items-start gap-3",
                    item.state === "done" && "opacity-60",
                    item.state === "upcoming" && "opacity-50",
                  )}
                >
                  <TimelineMarker state={item.state} position={index + 1} />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "font-mono text-mono-label text-on-surface",
                        item.state === "active" && "font-bold text-primary",
                      )}
                    >
                      Question {index + 1}
                    </p>
                    {item.state === "active" ? (
                      <p className="mt-1 text-label-caps uppercase tracking-wide text-on-surface-variant">
                        Active
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </section>

        {/* Center: answer work area (composer is a later slice) */}
        <section
          aria-label="Your answer"
          className="flex flex-1 flex-col p-gutter"
        >
          <div className="flex flex-1 flex-col rounded-xl border border-outline-variant bg-surface-container-lowest">
            <div className="border-b border-outline-variant bg-surface px-4 py-3">
              <h2 className="text-label-caps uppercase tracking-wide text-on-surface-variant">
                Your answer
              </h2>
            </div>
            <div className="flex flex-1 items-center justify-center p-6 text-center">
              <p className="max-w-prose text-body-md text-on-surface-variant">
                The speech-first answer composer opens here when you respond.
              </p>
            </div>
          </div>
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
