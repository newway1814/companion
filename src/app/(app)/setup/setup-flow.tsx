"use client";

import { FileText, Target } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Card } from "@/components/ui/card";
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
  "inline-flex items-center justify-center rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

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

  return (
    <div className="mx-auto max-w-5xl p-gutter">
      <h1 className="font-heading text-display-md text-on-surface">
        Set up your practice session
      </h1>
      <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">
        Companion will pressure-test your resume claims against your target
        role. Confirm what was extracted, then start a speech-first technical
        project deep-dive.
      </p>

      <div className="mt-8 grid gap-gutter md:grid-cols-2">
        <Card title="Source resume">
          {resume ? (
            <>
              <p className="flex items-center gap-2 text-body-md text-on-surface">
                <FileText
                  className="size-4 shrink-0 text-on-surface-variant"
                  aria-hidden="true"
                />
                {resume.filename}
              </p>
              {resume.claims ? (
                <p className="mt-2 text-body-md text-on-surface-variant">
                  {resume.claims.length} project claim
                  {resume.claims.length === 1 ? "" : "s"} extracted.
                </p>
              ) : (
                <p className="mt-2 text-body-md text-on-surface-variant">
                  Not analyzed yet.{" "}
                  <Link href="/resumes" className="text-primary hover:underline">
                    Analyze your resume
                  </Link>
                  .
                </p>
              )}
            </>
          ) : (
            <p className="text-body-md text-on-surface-variant">
              No resume yet.{" "}
              <Link href="/resumes" className="text-primary hover:underline">
                Add a resume
              </Link>
              .
            </p>
          )}
        </Card>

        <Card title="Target role">
          {role ? (
            <>
              <p className="flex items-center gap-2 text-body-md text-on-surface">
                <Target
                  className="size-4 shrink-0 text-on-surface-variant"
                  aria-hidden="true"
                />
                {role.title}
              </p>
              {role.requirements ? (
                <p className="mt-2 text-body-md text-on-surface-variant">
                  {role.requirements.length} requirement
                  {role.requirements.length === 1 ? "" : "s"} extracted.
                </p>
              ) : (
                <p className="mt-2 text-body-md text-on-surface-variant">
                  Not analyzed yet.{" "}
                  <Link href="/roles" className="text-primary hover:underline">
                    Analyze your target role
                  </Link>
                  .
                </p>
              )}
            </>
          ) : (
            <p className="text-body-md text-on-surface-variant">
              No target role yet.{" "}
              <Link href="/roles" className="text-primary hover:underline">
                Add a target role
              </Link>
              .
            </p>
          )}
        </Card>
      </div>

      {resume?.claims != null && role?.requirements != null ? (
        <section className="mt-8" aria-label="Extraction review">
          <h2 className="font-heading text-section-title text-on-surface">
            Review what Companion extracted
          </h2>
          <div className="mt-3 grid gap-gutter md:grid-cols-2">
            <div>
              <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
                Project claims
              </p>
              <ul className="mt-2 list-disc pl-5 text-body-md text-on-surface">
                {resume.claims.map((claim, index) => (
                  <li key={index}>
                    {claim.title}
                    {claim.weakSpots.length
                      ? ` — gaps: ${claim.weakSpots.join(", ")}`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
                Role requirements
              </p>
              <ul className="mt-2 list-disc pl-5 text-body-md text-on-surface">
                {role.requirements.map((requirement, index) => (
                  <li key={index}>
                    {requirement.text} ({requirement.importance})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <label className="mt-4 flex items-start gap-2 text-body-md text-on-surface">
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
            </button>
            <ul
              role="status"
              className="mt-3 space-y-1 text-body-md text-on-surface-variant"
            >
              {readiness.blockers.map((blocker, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
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
