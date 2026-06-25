import { describe, expect, it } from "vitest";

import { validateTargetRoleInput } from "./validation";

describe("validateTargetRoleInput", () => {
  it("accepts a title with a description", () => {
    expect(
      validateTargetRoleInput({ title: "Backend Intern", rawText: "Build APIs…" }),
    ).toEqual({ ok: true });
  });

  it("requires a title", () => {
    const result = validateTargetRoleInput({ title: "  ", rawText: "x" });
    expect(result.ok).toBe(false);
    expect(result).toHaveProperty("error", expect.stringMatching(/title/i));
  });

  it("requires a role description", () => {
    const result = validateTargetRoleInput({ title: "SWE", rawText: "" });
    expect(result.ok).toBe(false);
    expect(result).toHaveProperty("error", expect.stringMatching(/description|posting/i));
  });
});
