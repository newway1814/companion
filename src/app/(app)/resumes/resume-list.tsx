"use client";

import { ArrowRight, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { formatResumeDate } from "./format";
import type { ResumeSummary } from "./types";

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
      <p className="text-body-md text-on-surface-variant">
        No resumes yet. Add one to get started.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {resumes.map((resume) => (
        <li
          key={resume.id}
          className={cn(
            "rounded-lg border p-3 transition-colors",
            resume.isActive
              ? "border-primary/60 bg-surface-container-low"
              : "border-outline-variant hover:border-outline hover:bg-surface-container-low/60",
          )}
        >
          <Link
            href={`/resumes/${resume.id}`}
            className="group flex items-start gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FileText
              className="mt-0.5 size-4 shrink-0 text-on-surface-variant"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-md text-on-surface">
                {resume.filename}
              </p>
              <p className="text-mono-label text-on-surface-variant">
                Uploaded: {formatResumeDate(resume.createdAt)}
                {resume.lastUsedAt
                  ? ` · Last used: ${formatResumeDate(resume.lastUsedAt)}`
                  : ""}
              </p>
            </div>
            {resume.isActive ? (
              <span className="text-label-caps uppercase tracking-wide text-primary">
                Active
              </span>
            ) : (
              <ArrowRight
                className="mt-0.5 size-4 shrink-0 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!resume.isActive ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelect(resume.id)}
              >
                Select
              </Button>
            ) : null}

            {confirmingId === resume.id ? (
              <span
                role="group"
                aria-label={`Delete ${resume.filename}?`}
                className="flex items-center gap-2"
              >
                <span className="text-body-md text-on-surface-variant">
                  Delete this resume?
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  autoFocus
                  className="border-error text-error"
                  onClick={() => {
                    onDelete(resume.id);
                    setConfirmingId(null);
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingId(null)}
                >
                  Cancel
                </Button>
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-error"
                onClick={() => setConfirmingId(resume.id)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
