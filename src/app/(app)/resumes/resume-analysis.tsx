"use client";

import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { ResumeProfile } from "@/lib/resume/extraction";

import type { AnalyzeResumeAction } from "./types";

const WEAK_SPOT_LABELS: Record<string, string> = {
  "missing-baseline": "Missing baseline",
  "vague-impact": "Vague impact",
  "unclear-ownership": "Unclear ownership",
  "missing-evidence": "Missing evidence",
};

export function ResumeAnalysis({
  resumeId,
  profile,
  action,
}: {
  resumeId: string;
  profile: ResumeProfile | null;
  action: AnalyzeResumeAction;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  if (!profile) {
    return (
      <div className="mt-6">
        <p className="text-body-md text-on-surface-variant">
          No claim analysis yet. Run the analyzer to surface project claims,
          metrics, and gaps.
        </p>
        <form action={formAction} className="mt-3">
          <input type="hidden" name="id" value={resumeId} />
          <Button type="submit" disabled={pending}>
            {pending ? "Analyzing…" : "Analyze claims"}
          </Button>
        </form>
        {state?.error ? (
          <p role="alert" className="mt-2 text-body-md text-on-error-container">
            {state.error}
          </p>
        ) : null}
        <p role="status" className="sr-only">
          {pending ? "Analyzing your resume…" : ""}
        </p>
      </div>
    );
  }

  const verified = profile.claims.filter((c) => c.status === "verified").length;
  const needsEvidence = profile.claims.length - verified;

  return (
    <section className="mt-8 space-y-5" aria-label="Project claims analysis">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-section-title text-on-surface">
          Project claims
        </h2>
        <p className="text-mono-label text-on-surface-variant">
          {verified} verified · {needsEvidence} need evidence
        </p>
      </div>

      {profile.skills.length > 0 ? (
        <details className="group rounded-lg border border-outline-variant bg-surface-container-lowest">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-2.5 text-body-md text-on-surface-variant transition-colors hover:text-on-surface">
            <span>Skills ({profile.skills.length})</span>
            <span className="text-mono-label transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <p className="border-t border-outline-variant px-4 py-3 text-body-md text-on-surface-variant">
            {profile.skills.join(", ")}
          </p>
        </details>
      ) : null}

      <ul className="grid gap-3 lg:grid-cols-2">
        {profile.claims.map((claim, index) => {
          const isVerified = claim.status === "verified";
          return (
            <li key={index}>
              <article
                className={cn(
                  "h-full rounded-lg border border-l-2 border-outline-variant bg-surface-container-lowest p-4",
                  isVerified ? "border-l-primary" : "border-l-evidence",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-body-lg font-medium leading-snug text-on-surface">
                    {claim.title}
                  </h3>
                  <StatusBadge
                    status={isVerified ? "verified" : "warning"}
                    label={isVerified ? "Verified" : "Needs evidence"}
                    className="shrink-0"
                  />
                </div>

                {claim.weakSpots.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-mono-label text-on-surface-variant">
                    {claim.weakSpots.map((spot) => (
                      <span key={spot}>{WEAK_SPOT_LABELS[spot] ?? spot}</span>
                    ))}
                  </div>
                ) : null}

                {claim.metrics.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {claim.metrics.map((metric, metricIndex) => (
                      <span
                        key={metricIndex}
                        className="rounded bg-surface-container px-2 py-0.5 text-mono-label text-on-surface-variant"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                ) : null}

                {claim.warning ? (
                  <p className="mt-3 flex items-start gap-1.5 text-body-md text-on-surface-variant">
                    <TriangleAlert
                      className="mt-0.5 size-3.5 shrink-0 text-secondary"
                      aria-hidden="true"
                    />
                    <span>{claim.warning}</span>
                  </p>
                ) : null}

                {claim.suggestedRevision ? (
                  <details className="group mt-3">
                    <summary className="cursor-pointer list-none text-body-md text-primary transition-colors hover:underline">
                      <span className="group-open:hidden">Show suggested rewrite</span>
                      <span className="hidden group-open:inline">Hide rewrite</span>
                    </summary>
                    <p className="mt-2 text-body-md italic text-on-surface-variant">
                      {claim.suggestedRevision}
                    </p>
                  </details>
                ) : null}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
