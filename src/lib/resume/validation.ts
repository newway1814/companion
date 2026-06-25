export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_RESUME_TYPE = "application/pdf";

export type ResumeValidation = { ok: true } | { ok: false; error: string };

/** Validates an uploaded resume file's type and size before it is stored. */
export function validateResumeUpload(file: {
  type: string;
  size: number;
}): ResumeValidation {
  if (file.type !== ACCEPTED_RESUME_TYPE) {
    return { ok: false, error: "Only PDF files are supported." };
  }
  if (file.size === 0) {
    return { ok: false, error: "That file is empty." };
  }
  if (file.size > MAX_RESUME_BYTES) {
    return { ok: false, error: "That file is too large (max 5 MB)." };
  }
  return { ok: true };
}
