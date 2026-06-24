import { describe, expect, it } from "vitest";

import { loadServerConfig } from "./config";

const completeEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  DATABASE_URL: "postgresql://pooled",
  DIRECT_URL: "postgresql://direct",
};

describe("loadServerConfig", () => {
  it("returns a typed config when every required variable is present", () => {
    const config = loadServerConfig(completeEnv);

    expect(config).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
      supabaseServiceRoleKey: "service-role-key",
      databaseUrl: "postgresql://pooled",
      directUrl: "postgresql://direct",
    });
  });

  it("throws naming every missing variable so misconfiguration fails fast", () => {
    const { SUPABASE_SERVICE_ROLE_KEY, DIRECT_URL, ...partialEnv } = completeEnv;
    void SUPABASE_SERVICE_ROLE_KEY;
    void DIRECT_URL;

    expect(() => loadServerConfig(partialEnv)).toThrowError(
      /SUPABASE_SERVICE_ROLE_KEY[\s\S]*DIRECT_URL|DIRECT_URL[\s\S]*SUPABASE_SERVICE_ROLE_KEY/,
    );
  });
});
