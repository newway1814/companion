import * as React from "react";

import { cn } from "@/lib/utils";

type TurnState = "completed" | "active" | "upcoming";

export interface TranscriptRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  speaker: string;
  state?: TurnState;
}

/** A single turn in the transcript timeline (question, answer, or follow-up). */
export function TranscriptRow({
  speaker,
  state = "upcoming",
  className,
  children,
  ...props
}: TranscriptRowProps) {
  return (
    <div
      aria-current={state === "active" ? "step" : undefined}
      data-state={state}
      className={cn(
        "flex flex-col gap-0.5 rounded-lg px-4 py-2 transition-colors",
        state === "active" && "bg-surface-container-low",
        state === "upcoming" && "opacity-60",
        className,
      )}
      {...props}
    >
      <span className="font-label-caps text-label-caps uppercase tracking-wide text-on-surface-variant">
        {speaker}
      </span>
      <span className="text-body-md text-on-surface">{children}</span>
    </div>
  );
}
