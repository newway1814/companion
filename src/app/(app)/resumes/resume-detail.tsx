import { formatResumeDate } from "./format";
import type { ResumeSummary } from "./types";

export function ResumeDetail({ resume }: { resume: ResumeSummary | null }) {
  if (!resume) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-outline-variant p-8 text-center text-body-md text-on-surface-variant">
        Select or add a resume to see its details.
      </div>
    );
  }

  return (
    <div>
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Resume
      </p>
      <h1 className="font-heading text-display-md text-on-surface">
        {resume.filename}
      </h1>
      <p className="mt-1 text-mono-label text-on-surface-variant">
        Uploaded: {formatResumeDate(resume.createdAt)}
      </p>
      <details className="group mt-4 rounded-lg border border-outline-variant bg-surface-container-lowest">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-body-md text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span>View resume text</span>
          <span className="text-mono-label transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="max-h-[50vh] overflow-auto whitespace-pre-wrap border-t border-outline-variant p-4 text-body-md text-on-surface">
          {resume.rawText}
        </div>
      </details>
    </div>
  );
}
