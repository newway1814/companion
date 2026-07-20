"use client";

import { ArrowRight, FileText, ListChecks, Target } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { evaluateSetupReadiness } from "@/lib/setup/readiness";

export type SetupResumeView = {
  id: string;
  filename: string;
  claims: { title: string; weakSpots: string[] }[] | null;
} | null;

export type SetupRoleView = {
  id: string;
  title: string;
  requirements: { text: string; importance: string }[] | null;
} | null;

const primaryAction =
  "inline-flex items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function SourceCard({
  icon: Icon,
  kind,
  present,
  name,
  analyzed,
  count,
  countLabel,
  addHref,
  addLabel,
  analyzeHref,
}: {
  icon: typeof FileText;
  kind: string;
  present: boolean;
  name: string;
  analyzed: boolean;
  count: number;
  countLabel: string;
  addHref: string;
  addLabel: string;
  analyzeHref: string;
}) {
  const status: Status = !present ? "missing" : analyzed ? "verified" : "warning";
  const statusLabel = !present ? "Not added" : analyzed ? "Ready" : "Not analyzed";

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant"
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
              {kind}
            </p>
            <p className="truncate text-body-md font-medium text-on-surface">
              {present ? name : `No ${kind.toLowerCase()} selected`}
            </p>
          </div>
        </div>
        <StatusBadge status={status} label={statusLabel} className="shrink-0" />
      </div>

      <p className="mt-3 text-body-md text-on-surface-variant">
        {!present ? (
          <Link href={addHref} className="text-primary hover:underline">
            {addLabel}
          </Link>
        ) : analyzed ? (
          <>
            {count} {countLabel}
            {count === 1 ? "" : "s"} extracted.
          </>
        ) : (
          <>
            Not analyzed yet.{" "}
            <Link href={analyzeHref} className="text-primary hover:underline">
              Analyze now
            </Link>
            .
          </>
        )}
      </p>
    </div>
  );
}

export function SetupFlow({
  resume,
  role,
}: {
  resume: SetupResumeView;
  role: SetupRoleView;
}) {
  const [reviewed, setReviewed] = React.useState(false);

  const readiness = evaluateSetupReadiness({
    resume: resume ? { analyzed: resume.claims !== null } : null,
    role: role ? { analyzed: role.requirements !== null } : null,
    reviewed,
  });

  const bothAnalyzed = resume?.claims != null && role?.requirements != null;

  return (
    <div className="mx-auto max-w-5xl p-gutter">
      <h1 className="font-heading text-display-md text-on-surface">
        Set up your practice session
      </h1>
      <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">
        Companion will pressure-test your resume claims against your target role.
        Confirm what was extracted, then start a speech-first technical project
        deep-dive.
      </p>

      <div className="mt-8 grid gap-gutter md:grid-cols-2">
        <SourceCard
          icon={FileText}
          kind="Resume"
          present={resume != null}
          name={resume?.filename ?? ""}
          analyzed={resume?.claims != null}
          count={resume?.claims?.length ?? 0}
          countLabel="project claim"
          addHref="/resumes"
          addLabel="Add a resume"
          analyzeHref="/resumes"
        />
        <SourceCard
          icon={Target}
          kind="Target role"
          present={role != null}
          name={role?.title ?? ""}
          analyzed={role?.requirements != null}
          count={role?.requirements?.length ?? 0}
          countLabel="requirement"
          addHref="/roles"
          addLabel="Add a target role"
          analyzeHref="/roles"
        />
      </div>

      {bothAnalyzed ? (
        <section
          className="mt-8 rounded-xl border border-outline-variant bg-surface-container-lowest"
          aria-label="Extraction review"
        >
          <div className="border-b border-outline-variant px-5 py-4">
            <h2 className="font-heading text-section-title text-on-surface">
              Review what Companion extracted
            </h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              This is the evidence the room will hold you to. Confirm it looks
              right before you begin.
            </p>
          </div>

          <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
                <ListChecks className="size-3.5" aria-hidden="true" />
                Project claims
              </p>
              <ul className="mt-3 space-y-2">
                {resume.claims!.map((claim, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-outline-variant bg-surface p-3"
                  >
                    <p className="text-body-md text-on-surface">{claim.title}</p>
                    {claim.weakSpots.length ? (
                      <p className="mt-1 text-mono-label text-evidence">
                        gaps: {claim.weakSpots.join(", ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
                <Target className="size-3.5" aria-hidden="true" />
                Role requirements
              </p>
              <ul className="mt-3 space-y-2">
                {role.requirements!.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-surface p-3"
                  >
                    <span className="text-body-md text-on-surface">
                      {requirement.text}
                    </span>
                    <span className="shrink-0 text-mono-label uppercase tracking-wide text-on-surface-variant">
                      {requirement.importance}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <label className="flex items-start gap-3 border-t border-outline-variant px-5 py-4 text-body-md text-on-surface">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(event) => setReviewed(event.target.checked)}
              className="mt-1 size-4 rounded border-outline-variant text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <span>
              I&apos;ve reviewed these claims and requirements — they look right.
              To edit, update your{" "}
              <Link href="/resumes" className="text-primary hover:underline">
                resume
              </Link>{" "}
              or{" "}
              <Link href="/roles" className="text-primary hover:underline">
                role
              </Link>{" "}
              and re-analyze.
            </span>
          </label>
        </section>
      ) : null}

      <div className="mt-8">
        {readiness.ready ? (
          <Link href="/interview-setup" className={primaryAction}>
            Continue to interview setup
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        ) : (
          <>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className={`${primaryAction} cursor-not-allowed opacity-50`}
            >
              Continue to interview setup
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
            <ul
              role="status"
              className="mt-4 space-y-1.5 text-body-md text-on-surface-variant"
            >
              {readiness.blockers.map((blocker, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-evidence"
                    aria-hidden="true"
                  />
                  {blocker}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
