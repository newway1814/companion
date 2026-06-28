"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth";
import { deleteInterviewSession } from "@/lib/interview/repository";

/** Deletes one of the signed-in user's sessions (scoped) and refreshes history. */
export async function deleteSessionAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;

  const sessionId = String(formData.get("sessionId") ?? "");
  if (!sessionId) return;

  await deleteInterviewSession(user.id, sessionId);
  revalidatePath("/sessions");
}
