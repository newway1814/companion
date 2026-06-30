import { getUser } from "@/lib/auth";
import { Reveal } from "@/components/motion/reveal";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";

import { addResumeAction, deleteResumeAction, selectResumeAction } from "./actions";
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

  return (
    <div className="mx-auto max-w-4xl p-gutter">
      <Reveal>
        <h1 className="font-heading text-display-md text-on-surface">Resumes</h1>
        <p className="mt-1 max-w-prose text-body-lg text-on-surface-variant">
          Add a resume, then open it to see Companion&apos;s claim analysis.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-gutter md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
        <Reveal delay={0.06} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <h2 className="mb-4 font-heading text-section-title text-on-surface">
            Add a resume
          </h2>
          <ResumeUploadForm action={addResumeAction} />
        </Reveal>

        <Reveal delay={0.12}>
          <h2 className="mb-3 font-heading text-section-title text-on-surface">
            Saved resumes
          </h2>
          <ResumeList
            resumes={resumes}
            onSelect={selectResumeAction}
            onDelete={deleteResumeAction}
          />
        </Reveal>
      </div>
    </div>
  );
}
