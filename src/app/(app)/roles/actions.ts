"use server";

import { revalidatePath } from "next/cache";

import { AiSafetyError } from "@/lib/ai/gateway";
import { getUser } from "@/lib/auth";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";
import { extractRoleRequirements } from "@/lib/target-role/extraction";
import {
  createTargetRole,
  deleteTargetRole,
  getTargetRoleForUser,
  setActiveTargetRole,
  setRoleRequirements,
  updateTargetRole,
} from "@/lib/target-role/repository";
import { validateTargetRoleInput } from "@/lib/target-role/validation";
import { getOrCreateUser } from "@/lib/user";

import type { AnalyzeRoleState, TargetRoleFormState } from "./types";

/** Summarises the user's active resume profile as context for role-fit notes. */
async function buildResumeContext(userId: string): Promise<string | null> {
  const resumes = await listResumes(userId);
  const active = resumes.find((resume) => resume.isActive) ?? resumes[0];
  if (!active) return null;

  const parsed = ResumeProfileSchema.safeParse(active.parsedProfile);
  if (!parsed.success) return null;

  const { skills, claims } = parsed.data;
  const claimLines = claims.map((claim) => {
    const gaps = claim.weakSpots.length ? `, gaps: ${claim.weakSpots.join("/")}` : "";
    return `${claim.title} [${claim.status}${gaps}]`;
  });
  return `Skills: ${skills.join(", ")}\nClaims: ${claimLines.join("; ")}`;
}

export async function saveTargetRoleAction(
  _prev: TargetRoleFormState,
  formData: FormData,
): Promise<TargetRoleFormState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };
  await getOrCreateUser(user);

  const idValue = formData.get("id");
  const id = idValue ? String(idValue) : null;
  const title = String(formData.get("title") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "").trim() || null;
  const rawText = String(formData.get("rawText") ?? "").trim();

  const validation = validateTargetRoleInput({ title, rawText });
  if (!validation.ok) return { error: validation.error };

  if (id) {
    await updateTargetRole(user.id, id, { title, company, status, rawText });
  } else {
    await createTargetRole({ userId: user.id, title, company, status, rawText });
  }

  revalidatePath("/roles");
  return { ok: true };
}

export async function analyzeRoleAction(
  _prev: AnalyzeRoleState,
  formData: FormData,
): Promise<AnalyzeRoleState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };

  const id = String(formData.get("id"));
  const role = await getTargetRoleForUser(user.id, id);
  if (!role) return { error: "Role not found." };

  try {
    const resumeContext = await buildResumeContext(user.id);
    const requirements = await extractRoleRequirements(role.rawText, resumeContext);
    await setRoleRequirements(user.id, id, requirements);
  } catch (error) {
    if (error instanceof AiSafetyError) {
      return { error: "The analysis was blocked by a safety check." };
    }
    return { error: "Could not analyze this role. Please try again." };
  }

  revalidatePath("/roles");
  return { error: undefined };
}

export async function selectTargetRoleAction(id: string) {
  const user = await getUser();
  if (!user) return;
  await setActiveTargetRole(user.id, id);
  revalidatePath("/roles");
}

export async function deleteTargetRoleAction(id: string) {
  const user = await getUser();
  if (!user) return;
  await deleteTargetRole(user.id, id);
  revalidatePath("/roles");
}
