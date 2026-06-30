"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, Zap } from "lucide-react";

import type { ChallengeView } from "./room-view";

/**
 * The live challenge moment, shown above the composer when Companion asks an
 * adaptive follow-up. Red/error treatment marks the gap; the vague span is
 * highlighted in amber. Pressure stays on the answer, never the person.
 * Animates in to make the "aha" moment land.
 */
export function ChallengeBanner({
  challenge,
  onUseChip,
}: {
  challenge: ChallengeView;
  onUseChip?: (chip: string) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl border border-error/40 bg-error-container/30 p-4"
    >
      <span
        className="absolute inset-y-0 left-0 w-1 rounded-l bg-error"
        aria-hidden="true"
      />
      <div className="ml-2 flex flex-col gap-3">
        <span className="flex items-center gap-1.5 text-label-caps font-bold uppercase tracking-wide text-error">
          <Zap className="size-4" aria-hidden="true" />
          Challenge
        </span>

        <p className="font-heading text-section-title text-on-surface">
          {challenge.followUpQuestion}
        </p>

        <p role="alert" className="text-body-md text-on-surface-variant">
          {challenge.reason}
        </p>

        {challenge.challengedClaim ? (
          <p className="text-mono-label text-on-surface-variant">
            Claim under test: {challenge.challengedClaim}
          </p>
        ) : null}

        {challenge.weakSpan ? (
          <p className="text-body-md text-on-surface">
            You said:{" "}
            <mark className="rounded bg-evidence/20 px-1 text-on-evidence underline decoration-dashed decoration-2 underline-offset-2">
              {challenge.weakSpan}
            </mark>
          </p>
        ) : null}

        {challenge.improvementChips.length ? (
          <div>
            <p className="mb-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
              Improve your answer
            </p>
            <ul className="flex flex-wrap gap-2">
              {challenge.improvementChips.map((chip, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => onUseChip?.(chip)}
                    className="flex items-center gap-1 rounded-full border border-evidence/60 bg-evidence/10 px-3 py-1 text-body-md text-on-evidence transition-colors hover:bg-evidence/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                    {chip}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
