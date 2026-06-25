import type { ResumeProfile } from "@/lib/resume/extraction";

export type AddResumeState = { error?: string } | null;

export type AddResumeAction = (
  state: AddResumeState,
  formData: FormData,
) => Promise<AddResumeState>;

export type AnalyzeResumeState = { error?: string } | null;

export type AnalyzeResumeAction = (
  state: AnalyzeResumeState,
  formData: FormData,
) => Promise<AnalyzeResumeState>;

/** Serializable resume fields passed to client components. */
export type ResumeSummary = {
  id: string;
  filename: string;
  rawText: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
  profile: ResumeProfile | null;
};
