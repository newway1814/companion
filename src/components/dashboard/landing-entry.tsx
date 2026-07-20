import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  History,
  ShieldCheck,
  Target,
} from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { StatusBadge, type Status } from "@/components/ui/status-badge";

const WEAK_SPOT_LABELS: Record<string, string> = {
  "missing-baseline": "Missing baseline",
  "vague-impact": "Vague impact",
  "unclear-ownership": "Unclear ownership",
  "missing-evidence": "Missing evidence",
};

export type DashboardResume = {
  id: string;
  filename: string;
  analyzed: boolean;
  claimCount: number;
  needsEvidenceCount: number;
  topClaims: { title: string; verified: boolean; weakSpots: string[] }[];
} | null;

export type DashboardRole = {
  id: string;
  title: string;
  company: string | null;
  analyzed: boolean;
  requirementCount: number;
} | null;

export type DashboardSession = {
  id: string;
  dateLabel: string;
  resumeName: string;
  roleTitle: string;
  statusLabel: string;
  readinessBand: string | null;
  readinessScore: number | null;
  href: string;
};

export type DashboardData = {
  resume: DashboardResume;
  role: DashboardRole;
  sessions: DashboardSession[];
  totalSessions: number;
};

const EMPTY: DashboardData = {
  resume: null,
  role: null,
  sessions: [],
  totalSessions: 0,
};

const BAND_STATUS: Record<string, Status> = {
  strong: "verified",
  solid: "incomplete",
  developing: "warning",
};

/** One line of the pre-flight checklist: a source, its state, and the next action. */
function ReadinessRow({
  icon: Icon,
  kind,
  name,
  detail,
  status,
  statusLabel,
  action,
}: {
  icon: typeof FileText;
  kind: string;
  name: string;
  detail: string;
  status: Status;
  statusLabel: string;
  action: { label: string; href: string } | null;
}) {
  const tint =
    status === "verified"
      ? "text-primary"
      : status === "missing"
        ? "text-on-surface-variant"
        : "text-evidence";
  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container"
        aria-hidden="true"
      >
        <Icon className={`size-5 ${tint}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
          {kind}
        </p>
        <p className="truncate text-body-md font-medium text-on-surface">{name}</p>
        <p className="truncate text-mono-label text-on-surface-variant">{detail}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={status} label={statusLabel} />
        {action ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 rounded text-mono-label text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {action.label}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </li>
  );
}

/** Signed-in flight deck: real readiness state, the launch control, and history. */
export function LandingEntry({ data = EMPTY }: { data?: DashboardData }) {
  const { resume, role, sessions, totalSessions } = data;

  const resumeStatus: { status: Status; label: string; action: { label: string; href: string } | null } =
    !resume
      ? { status: "missing", label: "Not added", action: { label: "Add", href: "/resumes" } }
      : !resume.analyzed
        ? { status: "warning", label: "Not analyzed", action: { label: "Analyze", href: `/resumes/${resume.id}` } }
        : { status: "verified", label: "Ready", action: null };

  const roleStatus: { status: Status; label: string; action: { label: string; href: string } | null } =
    !role
      ? { status: "missing", label: "Not added", action: { label: "Add", href: "/roles" } }
      : !role.analyzed
        ? { status: "warning", label: "Not analyzed", action: { label: "Analyze", href: "/roles" } }
        : { status: "verified", label: "Ready", action: null };

  const ready = resumeStatus.status === "verified" && roleStatus.status === "verified";
  const openItems = [resumeStatus, roleStatus].filter((s) => s.status !== "verified").length;

  const resumeDetail = !resume
    ? "Upload or paste a resume to source claims"
    : resume.analyzed
      ? `${resume.claimCount} claim${resume.claimCount === 1 ? "" : "s"} · ${resume.needsEvidenceCount} need evidence`
      : "Run the analyzer to surface claims";

  const roleDetail = !role
    ? "Add the role you're preparing for"
    : role.analyzed
      ? `${role.requirementCount} requirement${role.requirementCount === 1 ? "" : "s"} extracted`
      : "Run the analyzer to surface requirements";

  return (
    <div className="mx-auto max-w-6xl p-gutter">
      <Reveal>
        <header className="flex flex-wrap items-end justify-between gap-4 pb-2 pt-2">
          <div>
            <h1 className="font-heading text-display-md text-on-surface">
              Deep-dive control
            </h1>
            <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">
              Load a resume and a target role, then step into the room and defend
              your project claims under pressure.
            </p>
          </div>
        </header>
      </Reveal>

      <div className="mt-8 grid gap-gutter lg:grid-cols-[1.45fr_1fr] lg:items-start">
        {/* Launch instrument */}
        <Reveal delay={0.04}>
          <section
            aria-label="Session readiness"
            className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest"
          >
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
              <h2 className="font-heading text-section-title text-on-surface">
                Session readiness
              </h2>
              {ready ? (
                <StatusBadge status="verified" label="Ready" />
              ) : (
                <span className="text-mono-label text-on-surface-variant">
                  {openItems} to resolve
                </span>
              )}
            </div>

            <ul className="divide-y divide-outline-variant">
              <ReadinessRow
                icon={FileText}
                kind="Resume"
                name={resume?.filename ?? "No resume loaded"}
                detail={resumeDetail}
                status={resumeStatus.status}
                statusLabel={resumeStatus.label}
                action={resumeStatus.action}
              />
              <ReadinessRow
                icon={Target}
                kind="Target role"
                name={role?.title ?? "No role loaded"}
                detail={roleDetail}
                status={roleStatus.status}
                statusLabel={roleStatus.label}
                action={roleStatus.action}
              />
            </ul>

            <div className="border-t border-outline-variant bg-surface-dim/40 px-5 py-5">
              <Link
                href="/setup"
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:w-auto"
              >
                {ready ? "Start project deep-dive" : "Continue setup"}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <p className="mt-3 flex items-center gap-2 text-mono-label text-on-surface-variant">
                <ClipboardCheck className="size-3.5" aria-hidden="true" />
                5 questions · ~10–12 min · speech-first, typing always works
              </p>
            </div>
          </section>
        </Reveal>

        {/* Evidence readout / first-run teaching */}
        <Reveal delay={0.1}>
          {resume?.analyzed && resume.topClaims.length > 0 ? (
            <section
              aria-label="Claims to defend"
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5"
            >
              <h2 className="font-heading text-section-title text-on-surface">
                What you&apos;ll defend
              </h2>
              <p className="mt-1 text-body-md text-on-surface-variant">
                Companion pressure-tests these claims from your loaded resume.
              </p>
              <ul className="mt-4 space-y-3">
                {resume.topClaims.map((claim, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-outline-variant bg-surface p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-body-md font-medium leading-snug text-on-surface">
                        {claim.title}
                      </p>
                      <StatusBadge
                        status={claim.verified ? "verified" : "warning"}
                        label={claim.verified ? "Verified" : "Gap"}
                        className="shrink-0"
                      />
                    </div>
                    {claim.weakSpots.length > 0 ? (
                      <p className="mt-1.5 text-mono-label text-on-surface-variant">
                        {claim.weakSpots
                          .map((s) => WEAK_SPOT_LABELS[s] ?? s)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section
              aria-label="How the pressure works"
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5"
            >
              <span className="inline-flex items-center gap-1 rounded bg-evidence/15 px-2 py-0.5 text-label-caps font-bold uppercase tracking-wide text-on-evidence">
                Example challenge
              </span>
              <p className="mt-3 text-body-md text-on-surface-variant">
                Here&apos;s how a deep-dive challenge works. A resume claim like{" "}
                <mark className="rounded bg-evidence/20 px-1 text-on-evidence underline decoration-2 underline-offset-2">
                  reduced API latency by 40%
                </mark>{" "}
                gets pressure-tested:
              </p>
              <p className="mt-3 text-body-md font-medium text-on-surface">
                What was the original baseline latency, and how did your change
                specifically address the bottleneck compared to an off-the-shelf
                solution?
              </p>
            </section>
          )}
        </Reveal>
      </div>

      {/* Recent sessions */}
      <Reveal as="section" className="mt-10" delay={0.06}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-section-title text-on-surface">
            Recent sessions
          </h2>
          {totalSessions > 0 ? (
            <Link
              href="/sessions"
              className="inline-flex items-center gap-1 rounded text-body-md text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View all
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        {sessions.length > 0 ? (
          <ul className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            {sessions.map((session) => (
              <li key={session.id} className="border-b border-outline-variant last:border-b-0">
                <Link
                  href={session.href}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <span className="w-24 shrink-0 text-mono-label text-on-surface-variant">
                    {session.dateLabel}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-body-md text-on-surface">
                    {session.resumeName}
                    <span className="text-on-surface-variant"> → {session.roleTitle}</span>
                  </span>
                  {session.readinessScore != null && session.readinessBand ? (
                    <StatusBadge
                      status={BAND_STATUS[session.readinessBand] ?? "incomplete"}
                      label={`${session.readinessScore} · ${session.readinessBand}`}
                      className="shrink-0"
                    />
                  ) : (
                    <span className="shrink-0 text-mono-label text-on-surface-variant">
                      {session.statusLabel}
                    </span>
                  )}
                  <ArrowRight
                    className="size-4 shrink-0 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/50 py-10 text-center">
            <History className="size-6 text-on-surface-variant" aria-hidden="true" />
            <p className="max-w-sm text-body-md text-on-surface-variant">
              No sessions yet. Your completed deep-dives and coaching reports will
              collect here.
            </p>
          </div>
        )}
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-8 flex items-start gap-2 text-body-md text-on-surface-variant">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Private by default — your resumes and transcripts are never shared or
            used to train public models.
          </span>
        </p>
      </Reveal>
    </div>
  );
}
