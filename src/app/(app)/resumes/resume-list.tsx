"use client";

import { ArrowRight, CircleCheck, FileText, TriangleAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import { formatResumeDate } from "./format";
import type { ResumeSummary } from "./types";

function ClaimSummary({ resume }: { resume: ResumeSummary }) {
  if (!resume.profile) {
    return (
      <span className="inline-flex items-center gap-1.5 text-mono-label text-on-surface-variant">
        <span className="size-1.5 rounded-full bg-outline" aria-hidden="true" />
        Not analyzed yet
      </span>
    );
  }
  const total = resume.profile.claims.length;
  const gaps = resume.profile.claims.filter((c) => c.status !== "verified").length;
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-mono-label">
      <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
        <FileText className="size-3.5" aria-hidden="true" />
        {total} claim{total === 1 ? "" : "s"}
      </span>
      {gaps > 0 ? (
        <span className="inline-flex items-center gap-1.5 text-evidence">
          <TriangleAlert className="size-3.5" aria-hidden="true" />
          {gaps} need evidence
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-success">
          <CircleCheck className="size-3.5" aria-hidden="true" />
          all defensible
        </span>
      )}
    </span>
  );
}

export function ResumeList({
  resumes,
  onSelect,
  onDelete,
}: {
  resumes: ResumeSummary[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/50 px-6 py-10 text-center">
        <FileText className="size-6 text-on-surface-variant" aria-hidden="true" />
        <p className="max-w-xs text-body-md text-on-surface-variant">
          No resumes yet. Add one on the left — Companion will extract its project
          claims for you to defend.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {resumes.map((resume) => (
        <li
          key={resume.id}
          className={cn(
            "rounded-xl border bg-surface-container-lowest transition-colors",
            resume.isActive
              ? "border-primary/50 ring-1 ring-primary/20"
              : "border-outline-variant hover:border-outline",
          )}
        >
          <Link
            href={`/resumes/${resume.id}`}
            className="group flex items-start gap-3 rounded-t-xl px-4 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant"
              aria-hidden="true"
            >
              <FileText className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-body-md font-medium text-on-surface">
                  {resume.filename}
                </span>
                {resume.isActive ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary-container/25 px-1.5 py-0.5 text-label-caps font-bold uppercase tracking-wide text-primary">
                    Loaded
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-mono-label text-on-surface-variant">
                Uploaded {formatResumeDate(resume.createdAt)}
                {resume.lastUsedAt
                  ? ` · Last used ${formatResumeDate(resume.lastUsedAt)}`
                  : ""}
              </span>
            </span>
            <ArrowRight
              className="mt-1 size-4 shrink-0 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant px-4 py-2.5">
            <ClaimSummary resume={resume} />

            <div className="flex flex-wrap items-center gap-1">
              {!resume.isActive ? (
                <button
                  type="button"
                  onClick={() => onSelect(resume.id)}
                  className="inline-flex h-8 items-center rounded border border-outline-variant bg-surface-container-lowest px-3 text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Select
                </button>
              ) : null}

              {confirmingId === resume.id ? (
                <span
                  role="group"
                  aria-label={`Delete ${resume.filename}?`}
                  className="flex items-center gap-1"
                >
                  <span className="px-1 text-body-md text-on-surface-variant">
                    Delete?
                  </span>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => {
                      onDelete(resume.id);
                      setConfirmingId(null);
                    }}
                    className="inline-flex h-8 items-center rounded border border-error/60 px-3 text-body-md font-medium text-error transition-colors hover:bg-error-container/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    className="inline-flex h-8 items-center rounded px-3 text-body-md text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(resume.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-body-md text-on-surface-variant transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
