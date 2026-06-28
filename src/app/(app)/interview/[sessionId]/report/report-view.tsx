"use client";

import { CircleAlert, Sparkles } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { CoachingReport } from "@/lib/interview/report";

import type { GenerateReportAction } from "./types";

const BAND_LABEL: Record<CoachingReport["readiness"]["band"], string> = {
  developing: "Developing",
  solid: "Solid",
  strong: "Strong",
};

function GenerateReport({
  action,
  sessionId,
}: {
  action: GenerateReportAction;
  sessionId: string;
}) {
  const [state, formAction, pending] = React.useActionState(action, null);
  const error = state && "error" in state ? state.error : null;

  return (
    <div className="mx-auto max-w-xl p-gutter py-16 text-center">
      <h1 className="font-heading text-display-md text-on-surface">
        Coaching report
      </h1>
      <p className="mx-auto mt-3 max-w-prose text-body-lg text-on-surface-variant">
        Companion will score your answers and turn the session into specific
        coaching — readiness, claim-defense gaps, and stronger reframings.
      </p>
      <form action={formAction} className="mt-8 flex flex-col items-center gap-3">
        <input type="hidden" name="sessionId" value={sessionId} />
        <Button type="submit" disabled={pending} className="h-12 px-8 text-body-lg">
          <Sparkles className="size-5" aria-hidden="true" />
          {pending ? "Analyzing your answers…" : "Generate coaching report"}
        </Button>
      </form>
      {pending ? (
        <p role="status" className="mt-3 text-body-md text-on-surface-variant">
          Scoring your answers and writing your coaching report…
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="mx-auto mt-3 flex max-w-prose items-center justify-center gap-2 text-body-md text-on-error-container"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

const STATUS_TEXT: Record<
  CoachingReport["technicalDepth"][number]["status"],
  string
> = { verified: "Verified", incomplete: "Incomplete", missing: "Missing" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-section-title text-on-surface">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ReadyReport({ report }: { report: CoachingReport }) {
  return (
    <div className="mx-auto max-w-3xl p-gutter py-12">
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Overall readiness
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-heading text-display-md text-on-surface">
          {report.readiness.score}
          <span className="text-headline-sm text-on-surface-variant">/100</span>
        </span>
        <span className="rounded-full border border-outline-variant px-3 py-1 text-label-caps font-bold uppercase tracking-wide text-primary">
          {BAND_LABEL[report.readiness.band]}
        </span>
      </div>
      <p className="mt-3 max-w-prose text-body-lg text-on-surface-variant">
        {report.readiness.summary}
      </p>
      <p className="mt-2 text-mono-label text-on-surface-variant">
        Readiness reflects preparation quality for this interview, not a hiring
        outcome.
      </p>

      {report.technicalDepth.length ? (
        <Section title="Technical depth">
          <ul className="flex flex-col gap-2">
            {report.technicalDepth.map((item, index) => (
              <li
                key={index}
                className="rounded-lg border border-outline-variant p-3 text-body-md text-on-surface"
              >
                <span className="font-medium">{item.area}</span>{" "}
                <span className="text-on-surface-variant">
                  — {STATUS_TEXT[item.status]}. {item.note}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {report.claimDefenseVulnerabilities.length ? (
        <Section title="Claim-defense vulnerabilities">
          <ul className="flex flex-col gap-2">
            {report.claimDefenseVulnerabilities.map((item, index) => (
              <li
                key={index}
                className="rounded-lg border-l-4 border-l-evidence bg-surface-container-lowest p-3"
              >
                <p className="font-medium text-on-surface">{item.claim}</p>
                <p className="text-body-md text-on-surface-variant">{item.issue}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {report.suggestedReframing.length ? (
        <Section title="Suggested reframing">
          <ul className="flex flex-col gap-4">
            {report.suggestedReframing.map((item, index) => (
              <li key={index} className="rounded-lg border border-outline-variant p-4">
                <p className="text-body-md text-on-surface-variant">
                  <span className="text-label-caps uppercase tracking-wide">
                    Original:{" "}
                  </span>
                  {item.original}
                </p>
                <p className="mt-2 text-body-md text-on-surface">
                  <span className="text-label-caps uppercase tracking-wide text-primary">
                    Improved:{" "}
                  </span>
                  {item.improved}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Next practice">
        <p className="text-body-md text-on-surface">
          <span className="font-medium">{report.nextPractice.focus}:</span>{" "}
          {report.nextPractice.drill}
        </p>
      </Section>
    </div>
  );
}

export function ReportView({
  report,
  sessionId,
  generateAction,
}: {
  report: CoachingReport | null;
  sessionId: string;
  generateAction: GenerateReportAction;
}) {
  return report ? (
    <ReadyReport report={report} />
  ) : (
    <GenerateReport action={generateAction} sessionId={sessionId} />
  );
}
