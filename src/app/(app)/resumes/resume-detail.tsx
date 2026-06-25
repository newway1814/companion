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
      <div className="mt-4 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-body-md text-on-surface">
        {resume.rawText}
      </div>
    </div>
  );
}
