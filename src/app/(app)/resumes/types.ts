export type AddResumeState = { error?: string } | null;

export type AddResumeAction = (
  state: AddResumeState,
  formData: FormData,
) => Promise<AddResumeState>;

/** Serializable resume fields passed to client components. */
export type ResumeSummary = {
  id: string;
  filename: string;
  rawText: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
};
