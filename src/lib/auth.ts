import { createSupabaseServerClient } from "@/lib/supabase/server";

/** The current authenticated user, or null. For use in server components. */
export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
