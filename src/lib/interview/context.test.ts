import { describe, expect, it } from "vitest";

import type { ResumeProfile } from "@/lib/resume/extraction";
import type { RoleRequirements } from "@/lib/target-role/extraction";

import { buildResumeContext, buildRoleContext } from "./context";

const profile: ResumeProfile = {
  summary: "CS student with full-stack and AI experience.",
  skills: ["TypeScript", "PostgreSQL"],
  claims: [
    {
      title: "AI interview platform",
      technologies: ["Next.js"],
      metrics: [],
      status: "hypothesis",
      weakSpots: ["missing-baseline"],
      warning: "No baseline for the latency claim.",
      suggestedRevision: "",
    },
  ],
};

const requirements: RoleRequirements = {
  requirements: [
    { text: "Distributed systems", importance: "required" },
    { text: "Go", importance: "preferred" },
  ],
  impliedNeeds: ["On-call readiness"],
  companionNotes: [],
  starPrompts: [],
};

describe("buildResumeContext", () => {
  it("summarizes claims, their gaps, and skills for grounding", () => {
    const context = buildResumeContext(profile);

    expect(context).toContain("AI interview platform");
    expect(context).toContain("missing-baseline");
    expect(context).toContain("TypeScript");
  });
});

describe("buildRoleContext", () => {
  it("includes the role title, requirements with importance, and implied needs", () => {
    const context = buildRoleContext("Backend Intern", requirements);

    expect(context).toContain("Backend Intern");
    expect(context).toContain("Distributed systems");
    expect(context).toContain("required");
    expect(context).toContain("On-call readiness");
  });
});
