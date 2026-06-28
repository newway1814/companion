"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearWorkspaceData,
  deleteUserData,
  listResumeStoragePaths,
} from "@/lib/account/repository";
import { getUser } from "@/lib/auth";
import { removeResumeFiles } from "@/lib/resume/storage";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Hard-deletes all of the signed-in user's workspace data (and their files). */
export async function clearWorkspaceAction() {
  const user = await getUser();
  if (!user) return;

  const paths = await listResumeStoragePaths(user.id);
  await removeResumeFiles(paths);
  await clearWorkspaceData(user.id);

  for (const path of ["/", "/sessions", "/resumes", "/roles", "/settings"]) {
    revalidatePath(path);
  }
}

/**
 * Permanently deletes the signed-in user's account: their files, all their data
 * (cascade), and their auth identity. Then signs out and returns to sign-in.
 */
export async function deleteAccountAction() {
  const user = await getUser();
  if (!user) return;

  const paths = await listResumeStoragePaths(user.id);
  await removeResumeFiles(paths);
  await deleteUserData(user.id);

  const admin = createSupabaseAdminClient();
  await admin.auth.admin.deleteUser(user.id);

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/sign-in");
}
