import "server-only";

import { createClient } from "@supabase/supabase-js";

import { loadServerConfig } from "@/lib/config";

/**
 * Supabase admin client using the service-role key. Server-only — the
 * service-role key bypasses row-level security and must never reach the
 * browser. `import "server-only"` enforces this at build time.
 */
export function createSupabaseAdminClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = loadServerConfig();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
