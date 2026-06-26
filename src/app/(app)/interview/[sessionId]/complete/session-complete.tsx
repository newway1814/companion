import { ArrowRight, CircleCheck } from "lucide-react";
import Link from "next/link";

import type { CompletionSummary } from "./summary";

function count(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`;
}

/**
 * The session-complete bridge: a concise completion summary with the detected
 * issue counts and the hand-off into the coaching report (or another session).
 */
export function SessionComplete({
  sessionId,
  summary,
}: {
  sessionId: string;
  summary: CompletionSummary;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col p-gutter py-16">
      <div className="overflow-hidden rounded-xl border border-outline-variant border-t-4 border-t-primary bg-surface-container-lowest p-8 text-center shadow-sm">
        <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-primary-container/15 text-primary">
          <CircleCheck className="size-8" aria-hidden="true" />
        </span>

        <h1 className="font-heading text-display-md text-on-surface">
          Interview complete
        </h1>

        <p className="mx-auto mt-3 max-w-prose text-body-lg text-on-surface-variant">
          You completed a {summary.totalQuestions}-question deep-dive. Found{" "}
          <strong className="font-semibold text-on-surface">
            {count(summary.claimDefenseIssues, "claim-defense issue")}
          </strong>{" "}
          and{" "}
          <strong className="font-semibold text-on-surface">
            {count(summary.missingMetrics, "missing metric")}
          </strong>
          .
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/interview/${sessionId}/report`}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            View coaching report
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href="/setup"
            className="inline-flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest px-6 py-3 text-body-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Practice again
          </Link>
        </div>
      </div>
    </div>
  );
}
