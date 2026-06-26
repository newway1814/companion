import { Check } from "lucide-react";
import * as React from "react";

import { TranscriptRow } from "@/components/ui/transcript-row";
import { cn } from "@/lib/utils";

import type { RoomQuestionState, TranscriptItem } from "./room-view";

const STATE_TEXT: Record<RoomQuestionState, string> = {
  done: "Completed",
  active: "Active",
  upcoming: "Upcoming",
};

function Marker({
  state,
  position,
}: {
  state: RoomQuestionState;
  position: number;
}) {
  if (state === "done") {
    return (
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
        <Check className="size-3.5" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-mono-label",
        state === "active"
          ? "bg-primary text-on-primary"
          : "border border-outline-variant text-on-surface-variant",
      )}
    >
      {position}
    </span>
  );
}

/**
 * The interview-room transcript timeline: the five primary questions with
 * completed / active / upcoming states, and the answers and follow-ups nested
 * under their question as turns. Driven entirely by real session state.
 */
export function TranscriptTimeline({ items }: { items: TranscriptItem[] }) {
  return (
    <section
      aria-label="Transcript timeline"
      className="border-t border-outline-variant bg-surface-bright p-gutter"
    >
      <h3 className="mb-4 text-label-caps uppercase tracking-wide text-on-surface-variant">
        Transcript timeline
      </h3>
      <ol className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li
            key={item.questionId}
            aria-current={item.state === "active" ? "step" : undefined}
            className={cn(item.state === "upcoming" && "opacity-60")}
          >
            <div className="flex items-start gap-3">
              <Marker state={item.state} position={index + 1} />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-mono text-mono-label text-on-surface",
                    item.state === "active" && "font-bold text-primary",
                  )}
                >
                  {item.label}
                </p>
                <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
                  <span className={item.state === "active" ? undefined : "sr-only"}>
                    {STATE_TEXT[item.state]}
                  </span>
                </p>
                {item.turns.length ? (
                  <ul className="mt-2 flex flex-col gap-1 border-l border-outline-variant pl-2">
                    {item.turns.map((turn, turnIndex) => (
                      <li key={turnIndex}>
                        <TranscriptRow speaker={turn.speaker} state="completed">
                          {turn.content}
                        </TranscriptRow>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
