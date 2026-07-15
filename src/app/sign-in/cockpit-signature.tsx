/** Dim, redacted resume "claim" lines — the field of statements under scrutiny. */
function RedactedLines({ widths }: { widths: number[] }) {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {widths.map((w, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full bg-on-surface-variant/15"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/**
 * "Claim under scrutiny" — a quiet, in-glance demo of what Companion does: a
 * vague resume claim with one flagged fragment, and the sharp evidence-seeking
 * follow-up beneath it. Amber = evidence, per the design system; the sample
 * text is illustrative, not the viewer's own claim.
 */
export function CockpitSignature() {
  return (
    <div className="max-w-md">
      <RedactedLines widths={[62, 84, 48]} />

      <figure className="my-7 border-y border-outline-variant/70 py-7">
        <p className="mb-3 flex items-center gap-2 font-mono text-mono-label uppercase tracking-[0.2em] text-on-evidence">
          <span
            className="inline-block size-1.5 rounded-full bg-evidence"
            aria-hidden="true"
          />
          Flagged
        </p>

        <blockquote className="text-body-lg text-on-surface-variant">
          &ldquo;…and the system became{" "}
          <span className="font-medium text-on-evidence underline decoration-evidence decoration-2 underline-offset-4">
            significantly faster
          </span>
          .&rdquo;
        </blockquote>

        <figcaption className="mt-4 font-heading text-section-title text-on-surface">
          What was the baseline — and what did{" "}
          <span className="underline decoration-primary decoration-2 underline-offset-4">
            you
          </span>{" "}
          build?
        </figcaption>
      </figure>

      <RedactedLines widths={[74, 40]} />
    </div>
  );
}
