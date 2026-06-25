import { ArrowRight, History, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { EvidenceChip } from "@/components/ui/evidence-chip";

const primaryAction =
  "inline-flex items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-body-md font-semibold text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const secondaryAction =
  "inline-flex items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-6 py-3 text-body-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/** Signed-in dashboard gateway, positioned around defending project claims. */
export function LandingEntry() {
  return (
    <div className="mx-auto max-w-5xl p-gutter">
      <section className="grid gap-10 py-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-heading text-display-lg leading-tight text-on-surface">
            Practice defending your software project claims.
          </h1>
          <p className="mt-6 max-w-prose text-body-lg text-on-surface-variant">
            A technical interviewer that challenges vague answers using your
            resume and target role. Prepare for technical project deep-dives in
            a high-fidelity environment.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/setup" className={primaryAction}>
              Start project deep-dive
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link href="/sessions" className={secondaryAction}>
              View previous sessions
            </Link>
          </div>

          <p className="mt-6 flex items-start gap-2 text-body-md text-on-surface-variant">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              Private by default — your resumes and transcripts are never shared
              or used to train public models.
            </span>
          </p>
        </div>

        {/* Challenge-mechanic preview */}
        <Card className="border-l-4 border-l-evidence bg-surface-container-lowest">
          <EvidenceChip>Challenge identified</EvidenceChip>
          <p className="mt-3 text-body-md text-on-surface">
            Your resume says you{" "}
            <mark className="rounded bg-evidence/20 px-1 text-on-evidence underline decoration-2 underline-offset-2">
              reduced API latency by 40%
            </mark>
            .
          </p>
          <p className="mt-2 font-semibold text-on-surface">
            What was the original baseline latency, and how did your change
            specifically address the bottleneck compared to an off-the-shelf
            solution?
          </p>
        </Card>
      </section>

      <section className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-section-title text-on-surface">
            Previous sessions
          </h2>
          <Link
            href="/sessions"
            className="text-body-md text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View all
          </Link>
        </div>
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <History
              className="size-6 text-on-surface-variant"
              aria-hidden="true"
            />
            <p className="text-body-md text-on-surface-variant">
              No practice sessions yet. Start a project deep-dive to build your
              history.
            </p>
            <Link
              href="/setup"
              className="text-body-md font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Start your first session
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
