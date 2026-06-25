"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth";
import {
  createTargetRole,
  deleteTargetRole,
  setActiveTargetRole,
  updateTargetRole,
} from "@/lib/target-role/repository";
import { validateTargetRoleInput } from "@/lib/target-role/validation";
import { getOrCreateUser } from "@/lib/user";

import type { TargetRoleFormState } from "./types";

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
