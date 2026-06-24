import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Clears the session and redirects to sign-in (303 turns POST into GET). */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/sign-in", request.url), {
    status: 303,
  });
}
