import { describe, expect, it, vi } from "vitest";

import type { AiParseResult } from "@/lib/ai/gateway";

import { extractRoleRequirements, type RoleRequirements } from "./extraction";

const fixture: RoleRequirements = {
  requirements: [
    { text: "Distributed systems", importance: "required" },
    { text: "Go", importance: "preferred" },
  ],
  impliedNeeds: ["On-call readiness"],
  companionNotes: [
    {
      note: "The role wants measured latency work; your pub/sub claim lacks a baseline.",
      relatedResumeClaim: "Pub/sub latency work",
    },
  ],
  starPrompts: ["Draft a STAR story about owning a latency improvement end to end."],
};

function parseReturning(result: RoleRequirements) {
  return vi.fn(
    async (): Promise<AiParseResult<unknown>> => ({
      parsedOutput: result,
      stopReason: "STOP",
      model: "gemini-2.5-flash",
    }),
  );
}

describe("extractRoleRequirements", () => {
  it("returns requirements and implied needs", async () => {
    const result = await extractRoleRequirements("…role…", null, parseReturning(fixture));
    expect(result.requirements.some((r) => r.importance === "required")).toBe(true);
    expect(result.impliedNeeds).toContain("On-call readiness");
  });

  it("passes resume context into the prompt so notes can reference gaps", async () => {
    const parseFn = parseReturning(fixture);
    await extractRoleRequirements(
      "…role…",
      "Claim: Pub/sub latency work (missing baseline)",
      parseFn,
    );
    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.stringContaining("Pub/sub latency work"),
      }),
    );
  });

  it("instructs the model to make no hireability claims", async () => {
    const parseFn = parseReturning(fixture);
    await extractRoleRequirements("…role…", null, parseFn);
    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/never predict.*hired|hiring recommendation/i),
      }),
    );
  });
});
