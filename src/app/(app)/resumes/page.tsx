import { getUser } from "@/lib/auth";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";

import {
  addResumeAction,
  analyzeResumeAction,
  deleteResumeAction,
  selectResumeAction,
} from "./actions";
import { ResumeAnalysis } from "./resume-analysis";
import { ResumeDetail } from "./resume-detail";
import { ResumeList } from "./resume-list";
import { ResumeUploadForm } from "./resume-upload-form";
import type { ResumeSummary } from "./types";

export default async function ResumesPage() {
  const user = await getUser();
  const rows = user ? await listResumes(user.id) : [];

  const resumes: ResumeSummary[] = rows.map((resume) => {
    const parsed = ResumeProfileSchema.safeParse(resume.parsedProfile);
    return {
      id: resume.id,
      filename: resume.filename,
      rawText: resume.rawText,
      isActive: resume.isActive,
      createdAt: resume.createdAt,
      lastUsedAt: resume.lastUsedAt,
      profile: parsed.success ? parsed.data : null,
    };
  });
  const active = resumes.find((resume) => resume.isActive) ?? null;

  return (
    <div className="mx-auto grid max-w-[1400px] gap-gutter p-gutter md:grid-cols-[340px_1fr] md:items-start">
      <section
        aria-label="Resume library"
        className="space-y-8 md:sticky md:top-gutter md:max-h-[calc(100vh-3rem)] md:overflow-y-auto md:pr-1"
      >
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

      <section
        aria-label="Active resume"
        className="min-w-0 md:border-l md:border-outline-variant md:pl-gutter"
      >
        <ResumeDetail resume={active} />
        {active ? (
          <ResumeAnalysis
            resumeId={active.id}
            profile={active.profile}
            action={analyzeResumeAction}
          />
        ) : null}
      </section>
    </div>
  );
}
