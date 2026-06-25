"use client";

import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  FolderTree,
  Play,
  UserSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { EvidenceChip } from "@/components/ui/evidence-chip";

import type { InterviewSetupView, StartInterviewAction } from "./types";

// Stitch's static pill reads "Text-first", but the MVP is speech-first with a
// typed fallback (CONTEXT.md / IMPLEMENTATION_NOTES known gap). Copy follows the
// documented product direction while preserving the Stitch composition.
const SESSION_FRAMING =
  "5 questions • 10–12 minutes • Speech-first • Evidence-focused follow-ups";

// Companion's "interview preparation state" progress language (domain.md).
const PROGRESS_STEPS = [
  "Extracting project claims",
  "Matching to role requirements",
  "Preparing follow-up strategy",
];

function ContextCard({
  icon,
  eyebrow,
  caption,
  heading,
  chip,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  caption: string;
  heading: string;
  chip: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-6 bg-surface-container-lowest p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-surface-variant text-primary-container">
          {icon}
        </div>
        <div>
          <h2 className="font-heading text-section-title text-on-surface">
            {eyebrow}
          </h2>
          <p className="text-body-md text-on-surface-variant">{caption}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-start justify-center gap-4 rounded-lg border border-dashed border-outline-variant bg-surface-bright p-6">
        <p className="font-heading text-headline-sm text-on-surface">{heading}</p>
        {chip}
      </div>
    </li>
  );
}

export function InterviewSetup({
  view,
  startAction,
}: {
  view: InterviewSetupView;
  startAction: StartInterviewAction;
}) {
  const router = useRouter();
  const [state, formAction, pending] = React.useActionState(startAction, null);

  React.useEffect(() => {
    if (state && "sessionId" in state) {
      router.push(`/interview/${state.sessionId}`);
    }
  }, [state, router]);

  const error = state && "error" in state ? state.error : null;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-outline-variant bg-surface-container-lowest/80 px-gutter backdrop-blur-sm">
        <Link
          href="/setup"
          className="flex items-center gap-2 rounded text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          <span className="text-body-md">Cancel setup</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-12 p-gutter py-12">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-display-md text-on-surface">
            Session parameters locked
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Review the selected context before Companion builds your project
            deep-dive.
          </p>
        </div>

        <ul
          aria-label="Detected session context"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-outline-variant md:grid-cols-2"
        >
          <ContextCard
            icon={<FileText className="size-5" aria-hidden="true" />}
            eyebrow="Source profile"
            caption="Current resume"
            heading={view.resume.filename}
            chip={
              <EvidenceChip>
                <FolderTree className="size-4" aria-hidden="true" />
                {view.resume.projectCount} project
                {view.resume.projectCount === 1 ? "" : "s"} detected
              </EvidenceChip>
            }
          />
          <ContextCard
            icon={<UserSquare className="size-5" aria-hidden="true" />}
            eyebrow="Target position"
            caption="Job description"
            heading={view.role.title}
            chip={
              <EvidenceChip>
                <BadgeCheck className="size-4" aria-hidden="true" />
                {view.role.requirementCount} role requirement
                {view.role.requirementCount === 1 ? "" : "s"} found
              </EvidenceChip>
            }
          />
        </ul>

        <div className="flex flex-col items-center gap-6">
          <p className="rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-3 text-center font-mono text-mono-label text-on-surface-variant">
            {SESSION_FRAMING}
          </p>

          <form action={formAction} className="flex flex-col items-center gap-3">
            <Button
              type="submit"
              disabled={pending}
              className="h-12 px-8 text-body-lg"
            >
              <Play className="size-5" aria-hidden="true" />
              {pending ? "Preparing your session…" : "Start interview"}
            </Button>
          </form>

          {pending ? (
            <p role="status" className="text-body-md text-on-surface-variant">
              Preparing your session — {PROGRESS_STEPS.join(", ")}…
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="max-w-prose text-center text-body-md text-on-error-container"
            >
              {error}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
