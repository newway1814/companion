"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AiSafetyError } from "@/lib/ai/gateway";
import { getUser } from "@/lib/auth";
import { extractPdfText } from "@/lib/resume/extract-pdf";
import { extractResumeProfile } from "@/lib/resume/extraction";
import {
  createResume,
  deleteResume,
  getResumeForUser,
  setActiveResume,
  setResumeProfile,
  setResumeStoragePath,
} from "@/lib/resume/repository";
import { uploadResumeFile } from "@/lib/resume/storage";
import { validateResumeUpload } from "@/lib/resume/validation";
import { getOrCreateUser } from "@/lib/user";

import type { AddResumeState, AnalyzeResumeState } from "./types";

export async function addResumeAction(
  _prev: AddResumeState,
  formData: FormData,
): Promise<AddResumeState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };
  await getOrCreateUser(user);

  const file = formData.get("file");
  const pasted = String(formData.get("text") ?? "").trim();

  let createdId: string;

  if (file instanceof File && file.size > 0) {
    const validation = validateResumeUpload({ type: file.type, size: file.size });
    if (!validation.ok) return { error: validation.error };

    let rawText: string;
    try {
      rawText = await extractPdfText(new Uint8Array(await file.arrayBuffer()));
    } catch {
      return { error: "Could not read text from that PDF." };
    }
    if (!rawText) {
      return { error: "No text could be extracted from that PDF." };
    }

    const resume = await createResume({
      userId: user.id,
      filename: file.name,
      source: "UPLOAD",
      rawText,
    });
    createdId = resume.id;
    try {
      const path = await uploadResumeFile(user.id, resume.id, file);
      await setResumeStoragePath(user.id, resume.id, path);
    } catch (error) {
      // The raw text is already saved; the stored file is best-effort. Log the
      // message (not the file) so a missing PDF is diagnosable.
      console.error(
        `Resume file storage failed for resume ${resume.id}:`,
        error instanceof Error ? error.message : error,
      );
    }
  } else if (pasted) {
    const resume = await createResume({
      userId: user.id,
      filename: "Pasted resume",
      source: "PASTE",
      rawText: pasted,
    });
    createdId = resume.id;
  } else {
    return { error: "Add a PDF or paste your resume text." };
  }

  // Open the new resume's analysis page.
  revalidatePath("/resumes");
  redirect(`/resumes/${createdId}`);
}

export async function analyzeResumeAction(
  _prev: AnalyzeResumeState,
  formData: FormData,
): Promise<AnalyzeResumeState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };

  const id = String(formData.get("id"));
  const resume = await getResumeForUser(user.id, id);
  if (!resume) return { error: "Resume not found." };

  try {
    const profile = await extractResumeProfile(resume.rawText);
    await setResumeProfile(user.id, id, profile);
  } catch (error) {
    if (error instanceof AiSafetyError) {
      return { error: "The analysis was blocked by a safety check." };
    }
    return { error: "Could not analyze this resume. Please try again." };
  }

  revalidatePath("/resumes");
  revalidatePath(`/resumes/${id}`);
  return { error: undefined };
}

export async function selectResumeAction(id: string) {
  const user = await getUser();
  if (!user) return;
  await setActiveResume(user.id, id);
  revalidatePath("/resumes");
}

export async function deleteResumeAction(id: string) {
  const user = await getUser();
  if (!user) return;
  await deleteResume(user.id, id);
  revalidatePath("/resumes");
}
