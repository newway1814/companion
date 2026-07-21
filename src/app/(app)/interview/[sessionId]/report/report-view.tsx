"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleAlert, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { CoachingReport } from "@/lib/interview/report";

import type { GenerateReportAction } from "./types";

/** Counts up to `to` on mount (respects reduced motion). */
function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion();
  const [value, setValue] = React.useState(reduce ? to : 0);
  React.useEffect(() => {
    if (reduce) return;
    const controls = animate(0, to, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);
  return <>{value}</>;
}

export type ReportMeta = { roleTitle: string; completedAtISO: string };

export type ReportControlAction = (formData: FormData) => void | Promise<void>;

function sessionForm(sessionId: string): FormData {
  const data = new FormData();
  data.set("sessionId", sessionId);
  return data;
}

const REPORT_NAV = [
  { href: "/sessions", label: "Session history" },
  { href: "/resumes", label: "Resumes" },
  { href: "/roles", label: "Target roles" },
  { href: "/setup", label: "New session" },
] as const;

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

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
    <Reveal as="section" className="mt-8" y={12}>
      <h2 className="font-heading text-section-title text-on-surface">{title}</h2>
      <div className="mt-3">{children}</div>
    </Reveal>
  );
}

function ReadinessMeter({
  score,
  band,
}: {
  score: number;
  band: CoachingReport["readiness"]["band"];
}) {
  const reduce = useReducedMotion();
  return (
    <div
      role="progressbar"
      aria-label="Readiness score"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      className="w-full min-w-[180px] rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 sm:w-auto"
    >
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Readiness score
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-heading text-display-md leading-none text-on-surface">
          <CountUp to={score} />
          <span className="text-headline-sm text-on-surface-variant">/100</span>
        </span>
        <span className="text-label-caps font-bold uppercase tracking-wide text-primary">
          {BAND_LABEL[band]}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function ReadyReport({
  report,
  meta,
  sessionId,
  drillAction,
  improvedReadAction,
}: {
  report: CoachingReport;
  meta: ReportMeta;
  sessionId: string;
  drillAction: ReportControlAction;
  improvedReadAction: ReportControlAction;
}) {
  const date = formatDate(meta.completedAtISO);
  return (
    <div className="mx-auto max-w-3xl p-gutter py-12">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
            Post-session analysis{date ? ` • ${date}` : ""}
          </p>
          <h1 className="mt-1 font-heading text-display-md text-on-surface">
            Final coaching report
          </h1>
          <p className="mt-1 text-body-lg text-on-surface-variant">
            {meta.roleTitle} · Project deep-dive (mock interview)
          </p>
        </div>
        <ReadinessMeter
          score={report.readiness.score}
          band={report.readiness.band}
        />
      </header>

      <p className="mt-6 max-w-prose text-body-lg text-on-surface-variant">
        {report.readiness.summary}
      </p>
      <p className="mt-2 text-mono-label text-on-surface-variant">
        Readiness reflects preparation quality for this interview, not a hiring
        outcome.
      </p>

      {report.technicalDepth.length ? (
        <Section title="Technical depth">
          <ul className="grid gap-2 sm:grid-cols-2">
            {report.technicalDepth.map((item, index) => (
              <li
                key={index}
                className="rounded-lg border border-outline-variant p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-md font-medium text-on-surface">
                    {item.area}
                  </span>
                  <span className="rounded border border-outline-variant px-2 py-0.5 text-label-caps font-bold uppercase tracking-wide text-on-surface-variant">
                    {STATUS_TEXT[item.status]}
                  </span>
                </div>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  {item.note}
                </p>
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
                <button
                  type="button"
                  onClick={() => {
                    void improvedReadAction(sessionForm(sessionId));
                    navigator.clipboard?.writeText?.(item.improved);
                  }}
                  className="mt-2 inline-flex items-center gap-1 rounded text-body-md text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Copy className="size-4" aria-hidden="true" />
                  Copy improved answer
                </button>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Next recommended action">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
          <p className="text-body-md text-on-surface">
            <span className="font-medium">{report.nextPractice.focus}:</span>{" "}
            {report.nextPractice.drill}
          </p>
          <form action={drillAction} className="shrink-0">
            <input type="hidden" name="sessionId" value={sessionId} />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded bg-primary-container px-5 py-2 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Start focused drill
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </Section>

      <nav
        aria-label="Report navigation"
        className="mt-10 flex flex-wrap gap-2 border-t border-outline-variant pt-6"
      >
        {REPORT_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded border border-outline-variant px-4 py-2 text-body-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function ReportView({
  report,
  sessionId,
  meta,
  generateAction,
  drillAction,
  improvedReadAction,
}: {
  report: CoachingReport | null;
  sessionId: string;
  meta: ReportMeta;
  generateAction: GenerateReportAction;
  drillAction: ReportControlAction;
  improvedReadAction: ReportControlAction;
}) {
  return report ? (
    <ReadyReport
      report={report}
      meta={meta}
      sessionId={sessionId}
      drillAction={drillAction}
      improvedReadAction={improvedReadAction}
    />
  ) : (
    <GenerateReport action={generateAction} sessionId={sessionId} />
  );
}
