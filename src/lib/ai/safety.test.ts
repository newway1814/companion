import { describe, expect, it } from "vitest";

import { findSafetyViolations } from "./safety";

describe("findSafetyViolations", () => {
  it("flags employability / hireability claims", () => {
    expect(
      findSafetyViolations("You are very employable and will get the job."),
    ).toContain("employability-claim");
  });

  it("flags hiring recommendations", () => {
    expect(
      findSafetyViolations("Overall, I would recommend hiring this candidate."),
    ).toContain("hiring-recommendation");
  });

  it("flags protected-trait inferences", () => {
    expect(
      findSafetyViolations("Your answers suggest your age may be a concern."),
    ).toContain("protected-trait");
  });

  it("passes grounded coaching feedback with no violations", () => {
    expect(
      findSafetyViolations(
        "Add the baseline latency before the change so the 40% claim is verifiable.",
      ),
    ).toEqual([]);
  });
});
