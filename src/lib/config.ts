import { z } from "zod";

/**
 * Server-only configuration loaded from environment variables.
 *
 * This is a deliberately small surface: callers get a fully-typed, validated
 * config object or a single error that names every missing variable, so a
 * misconfigured deployment fails fast with an actionable message instead of
 * crashing later with a cryptic `undefined` somewhere downstream.
 */
export interface ServerConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  databaseUrl: string;
  directUrl: string;
}

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
});

export function loadServerConfig(
  env: Record<string, string | undefined> = process.env,
): ServerConfig {
  const result = schema.safeParse(env);

  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter((name, index, names) => names.indexOf(name) === index);

    throw new Error(
      `Missing or invalid environment variables: ${missing.join(", ")}. ` +
        "See .env.example for the full list.",
    );
  }

  return {
    supabaseUrl: result.data.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: result.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: result.data.SUPABASE_SERVICE_ROLE_KEY,
    databaseUrl: result.data.DATABASE_URL,
    directUrl: result.data.DIRECT_URL,
  };
}
