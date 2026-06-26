import { CircleCheck, CircleDashed, ClipboardCheck } from "lucide-react";

import type { EvidenceView } from "./room-view";

/**
 * The interview-room evidence panel: the resume claim under test, the
 * required-evidence checklist, and a short interviewer note. It shows the
 * current probing focus and the snippet being tested — never scoring internals
 * or chain-of-thought.
 */
export function EvidencePanel({ evidence }: { evidence: EvidenceView }) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
          <ClipboardCheck className="size-4" aria-hidden="true" />
          Target claim
        </h3>
        {evidence.targetClaim ? (
          <div className="relative rounded border border-evidence/30 bg-evidence/15 p-3">
            <span
              className="absolute inset-y-0 left-0 w-1 rounded-l bg-evidence"
              aria-hidden="true"
            />
            <p className="ml-2 font-medium text-body-md text-on-evidence">
              “{evidence.targetClaim}”
            </p>
          </div>
        ) : (
          <p className="text-body-md text-on-surface-variant">
            No claim under test.
          </p>
        )}
        {evidence.probingFocus ? (
          <p className="mt-2 text-mono-label text-on-surface-variant">
            Probing focus: {evidence.probingFocus}
          </p>
        ) : null}
      </section>

      <section>
        <h3
          id="required-evidence-heading"
          className="mb-3 text-label-caps uppercase tracking-wide text-on-surface-variant"
        >
          Required evidence
        </h3>
        {evidence.requiredEvidence.length ? (
          <ul
            aria-labelledby="required-evidence-heading"
            className="flex flex-col gap-2"
          >
            {evidence.requiredEvidence.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 rounded border border-outline-variant p-3"
              >
                {item.satisfied ? (
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                ) : (
                  <CircleDashed
                    className="mt-0.5 size-4 shrink-0 text-on-surface-variant"
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1 text-body-md text-on-surface">
                  {item.label}
                </span>
                <span className="sr-only">
                  {item.satisfied ? "Satisfied" : "Outstanding"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-md text-on-surface-variant">
            No required evidence for this question.
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
          Interviewer notes
        </h3>
        <p className="text-body-md italic text-on-surface-variant">
          {evidence.notes}
        </p>
      </section>
    </div>
  );
}
