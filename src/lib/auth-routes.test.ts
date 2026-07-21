import { describe, expect, it } from "vitest";

import { isProtectedRoute } from "./auth-routes";

describe("isProtectedRoute", () => {
  it("treats the sign-in, auth callback, and health routes as public", () => {
    expect(isProtectedRoute("/")).toBe(false);
    expect(isProtectedRoute("/sign-in")).toBe(false);
    expect(isProtectedRoute("/auth/callback")).toBe(false);
    expect(isProtectedRoute("/api/health")).toBe(false);
  });

  it("treats the app surface as protected", () => {
    expect(isProtectedRoute("/dashboard")).toBe(true);
    expect(isProtectedRoute("/resumes")).toBe(true);
    expect(isProtectedRoute("/sessions")).toBe(true);
  });

  it("does not treat a prefix sibling of a public route as public", () => {
    // "/sign-in-help" must not be considered the public "/sign-in" route.
    expect(isProtectedRoute("/sign-in-help")).toBe(true);
    expect(isProtectedRoute("/dashboard-preview")).toBe(true);
  });
});
