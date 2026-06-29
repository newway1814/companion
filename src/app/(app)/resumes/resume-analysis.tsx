"use client";

import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { ClaimCard } from "@/components/ui/claim-card";
import { EvidenceChip } from "@/components/ui/evidence-chip";
import { StatusBadge } from "@/components/ui/status-badge";
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

  return (
    <section className="mt-6 space-y-4" aria-label="Project claims analysis">
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Project claims analysis
      </p>
      {profile.skills.length > 0 ? (
        <p className="text-body-md text-on-surface-variant">
          Skills: {profile.skills.join(", ")}
        </p>
      ) : null}

      <ul className="grid gap-4 lg:grid-cols-2">
        {profile.claims.map((claim, index) => (
          <li key={index}>
            <ClaimCard
              title={claim.title}
              variant={claim.status === "verified" ? "verified" : "hypothesis"}
            >
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={claim.status === "verified" ? "verified" : "warning"}
                  label={claim.status === "verified" ? "Verified" : "Needs evidence"}
                />
                {claim.weakSpots.map((spot) => (
                  <span
                    key={spot}
                    className="text-label-caps uppercase tracking-wide text-on-secondary-container"
                  >
                    {WEAK_SPOT_LABELS[spot] ?? spot}
                  </span>
                ))}
              </div>

              {claim.metrics.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {claim.metrics.map((metric, metricIndex) => (
                    <EvidenceChip key={metricIndex}>{metric}</EvidenceChip>
                  ))}
                </div>
              ) : null}

              {claim.warning ? (
                <p className="mt-3 flex items-start gap-2 text-body-md text-on-surface">
                  <TriangleAlert
                    className="mt-0.5 size-4 shrink-0 text-secondary"
                    aria-hidden="true"
                  />
                  <span>{claim.warning}</span>
                </p>
              ) : null}

              {claim.suggestedRevision ? (
                <div className="mt-3">
                  <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
                    Suggested revision
                  </p>
                  <p className="mt-1 text-body-md italic text-on-surface">
                    {claim.suggestedRevision}
                  </p>
                </div>
              ) : null}
            </ClaimCard>
          </li>
        ))}
      </ul>
    </section>
  );
}
