import { getUser } from "@/lib/auth";
import { listResumes } from "@/lib/resume/repository";

import { addResumeAction, deleteResumeAction, selectResumeAction } from "./actions";
import { ResumeDetail } from "./resume-detail";
import { ResumeList } from "./resume-list";
import { ResumeUploadForm } from "./resume-upload-form";
import type { ResumeSummary } from "./types";

export default async function ResumesPage() {
  const user = await getUser();
  const rows = user ? await listResumes(user.id) : [];

  const resumes: ResumeSummary[] = rows.map((resume) => ({
    id: resume.id,
    filename: resume.filename,
    rawText: resume.rawText,
    isActive: resume.isActive,
    createdAt: resume.createdAt,
    lastUsedAt: resume.lastUsedAt,
  }));
  const active = resumes.find((resume) => resume.isActive) ?? null;

  return (
    <div className="grid gap-gutter p-gutter md:grid-cols-[320px_1fr]">
      <section aria-label="Resume library" className="space-y-8">
        <div>
          <h2 className="mb-3 font-heading text-section-title text-on-surface">
            Add a resume
          </h2>
          <ResumeUploadForm action={addResumeAction} />
        </div>
        <div>
          <h2 className="mb-3 font-heading text-section-title text-on-surface">
            Saved resumes
          </h2>
          <ResumeList
            resumes={resumes}
            onSelect={selectResumeAction}
            onDelete={deleteResumeAction}
          />
        </div>
      </section>

      <section aria-label="Active resume" className="md:border-l md:border-outline-variant md:pl-gutter">
        <ResumeDetail resume={active} />
      </section>
    </div>
  );
}
