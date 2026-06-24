import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in the browser. Reads the public (anon) credentials,
 * which are safe to expose to the client. Server-side auth wiring (cookies)
 * is added with the authentication slice.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
