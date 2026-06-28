import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "resumes";

/** Stores the resume PDF in the private bucket under the owner's folder. */
export async function uploadResumeFile(
  userId: string,
  resumeId: string,
  file: File,
): Promise<string> {
  const admin = createSupabaseAdminClient();
  const path = `${userId}/${resumeId}.pdf`;
  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) {
    throw new Error(`Failed to store resume file: ${error.message}`);
  }
  return path;
}

/** Removes a stored resume PDF. */
export async function deleteResumeFile(path: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  await admin.storage.from(BUCKET).remove([path]);
}

/** Removes many stored resume PDFs (best-effort, e.g. on clear/delete). */
export async function removeResumeFiles(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const admin = createSupabaseAdminClient();
  await admin.storage.from(BUCKET).remove(paths);
}
