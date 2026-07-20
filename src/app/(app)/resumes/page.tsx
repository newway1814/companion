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

  const analyzedCount = resumes.filter((r) => r.profile !== null).length;

  return (
    <div className="mx-auto max-w-5xl p-gutter">
      <Reveal>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-display-md text-on-surface">Resumes</h1>
            <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">
              Your evidence sources. Companion extracts the project claims from
              whichever resume is loaded, then pressure-tests them in the room.
            </p>
          </div>
          {resumes.length > 0 ? (
            <p className="shrink-0 text-mono-label text-on-surface-variant">
              {resumes.length} saved · {analyzedCount} analyzed
            </p>
          ) : null}
        </header>
      </Reveal>

      <div className="mt-8 grid gap-gutter md:grid-cols-[minmax(0,360px)_1fr] md:items-start">
        <Reveal
          delay={0.06}
          className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 md:sticky md:top-gutter"
        >
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
