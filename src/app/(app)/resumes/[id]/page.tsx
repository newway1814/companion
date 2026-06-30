import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { getUser } from "@/lib/auth";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { getResumeForUser } from "@/lib/resume/repository";

import { analyzeResumeAction, selectResumeAction } from "../actions";
import { ResumeAnalysis } from "../resume-analysis";
import { ResumeDetail } from "../resume-detail";
import type { ResumeSummary } from "../types";

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const resume = user ? await getResumeForUser(user.id, id) : null;
  if (!resume) notFound();

  const parsed = ResumeProfileSchema.safeParse(resume.parsedProfile);
  const summary: ResumeSummary = {
    id: resume.id,
    filename: resume.filename,
    rawText: resume.rawText,
    isActive: resume.isActive,
    createdAt: resume.createdAt,
    lastUsedAt: resume.lastUsedAt,
    profile: parsed.success ? parsed.data : null,
  };

  return (
    <div className="mx-auto max-w-4xl p-gutter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/resumes"
          className="inline-flex items-center gap-2 rounded text-body-md text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Resumes
        </Link>
        {summary.isActive ? (
          <span className="text-label-caps uppercase tracking-wide text-primary">
            Active for sessions
          </span>
        ) : (
          <form action={selectResumeAction.bind(null, summary.id)}>
            <button
              type="submit"
              className="rounded border border-outline-variant bg-surface-container-lowest px-4 py-1.5 text-body-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Use for sessions
            </button>
          </form>
        )}
      </div>

      <Reveal className="mt-6">
        <ResumeDetail resume={summary} />
      </Reveal>

      <ResumeAnalysis
        resumeId={summary.id}
        profile={summary.profile}
        action={analyzeResumeAction}
      />
    </div>
  );
}
