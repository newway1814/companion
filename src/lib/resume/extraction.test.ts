import { describe, expect, it, vi } from "vitest";

import type { AiParseResult } from "@/lib/ai/gateway";

import { extractResumeProfile, type ResumeProfile } from "./extraction";

const fixtureProfile: ResumeProfile = {
  summary: "Backend-leaning full-stack engineer.",
  skills: ["TypeScript", "PostgreSQL"],
  claims: [
    {
      title: "Pub/sub latency work",
      technologies: ["Node.js"],
      metrics: ["Reduced API latency by 40%"],
      status: "hypothesis",
      weakSpots: ["missing-baseline"],
      warning: "States a 40% gain but no baseline latency.",
      suggestedRevision: "Add the baseline latency before the change: [baseline] ms → [result] ms.",
    },
  ],
};

describe("extractResumeProfile", () => {
  it("returns the validated profile from the gateway", async () => {
    const parseFn = vi.fn(
      async (): Promise<AiParseResult<unknown>> => ({
        parsedOutput: fixtureProfile,
        stopReason: "STOP",
        model: "gemini-2.5-flash",
      }),
    );

    const profile = await extractResumeProfile("…resume…", parseFn);

    expect(profile.claims[0].weakSpots).toContain("missing-baseline");
    expect(profile.skills).toContain("TypeScript");
  });

  it("instructs the model not to fabricate facts", async () => {
    const parseFn = vi.fn(
      async (): Promise<AiParseResult<unknown>> => ({
        parsedOutput: fixtureProfile,
        stopReason: "STOP",
        model: "gemini-2.5-flash",
      }),
    );

    await extractResumeProfile("…resume…", parseFn);

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/never invent|do not invent/i),
      }),
    );
  });
});
