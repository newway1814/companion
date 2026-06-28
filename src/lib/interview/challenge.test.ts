import { describe, expect, it, vi } from "vitest";

import type { AiParseResult } from "@/lib/ai/gateway";

import { analyzeAnswer, type ChallengeAnalysis } from "./challenge";

const vagueClaim: ChallengeAnalysis = {
  shouldChallenge: true,
  challengedClaim: "Reduced API latency by 40%",
  reason:
    "You said performance improved, but an interviewer will want the baseline and how you measured it.",
  weakSpan: "I improved performance and made it scalable.",
  improvementChips: ["Add a baseline", "Add a measurement method"],
  followUpQuestion:
    "What was the original latency baseline, and how did you measure the 40% reduction?",
};

const supported: ChallengeAnalysis = {
  shouldChallenge: false,
  challengedClaim: "",
  reason: "",
  weakSpan: "",
  improvementChips: [],
  followUpQuestion: "",
};

function parseReturning(result: ChallengeAnalysis) {
  return vi.fn(
    async (): Promise<AiParseResult<unknown>> => ({
      parsedOutput: result,
      stopReason: "STOP",
      model: "gemini-2.5-flash",
    }),
  );
}

const baseInput = {
  questionText: "Walk me through the microservices migration.",
  objective: "Probe for a measured result.",
  targetClaim: "Reduced API latency by 40%",
  requiredEvidence: ["Gives a baseline", "Gives a measurement method"],
  answer: "I improved performance and made it scalable.",
};

describe("analyzeAnswer", () => {
  it("flags a vague answer and references the exact claim being challenged", async () => {
    const result = await analyzeAnswer(baseInput, parseReturning(vagueClaim));

    expect(result.shouldChallenge).toBe(true);
    expect(result.challengedClaim).toBe("Reduced API latency by 40%");
    expect(result.weakSpan.length).toBeGreaterThan(0);
    expect(result.improvementChips.length).toBeGreaterThan(0);
    expect(result.followUpQuestion.length).toBeGreaterThan(0);
  });

  it("does not challenge a well-supported answer", async () => {
    const result = await analyzeAnswer(baseInput, parseReturning(supported));

    expect(result.shouldChallenge).toBe(false);
  });

  it("flags a missing-metric answer and references the required evidence", async () => {
    const missingMetric: ChallengeAnalysis = {
      shouldChallenge: true,
      challengedClaim: "Reduced API latency by 40%",
      reason: "You named the result but not the baseline it was measured against.",
      weakSpan: "we made it 40% faster",
      improvementChips: ["Add a baseline", "Add a measurement method"],
      followUpQuestion: "40% faster than what baseline, and measured how?",
    };
    const result = await analyzeAnswer(
      { ...baseInput, answer: "We made it 40% faster after the rewrite." },
      parseReturning(missingMetric),
    );

    expect(result.shouldChallenge).toBe(true);
    expect(result.challengedClaim).toMatch(/latency/i);
    expect(result.improvementChips).toContain("Add a baseline");
  });

  it("grounds the analysis in the answer, claim, and required evidence", async () => {
    const parseFn = parseReturning(vagueClaim);
    await analyzeAnswer(baseInput, parseFn);

    for (const snippet of [
      "Reduced API latency by 40%",
      "I improved performance and made it scalable.",
      "Gives a baseline",
    ]) {
      expect(parseFn).toHaveBeenCalledWith(
        expect.objectContaining({ user: expect.stringContaining(snippet) }),
      );
    }
  });

  it("instructs the model to pressure the answer, not the person", async () => {
    const parseFn = parseReturning(vagueClaim);
    await analyzeAnswer(baseInput, parseFn);

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/pressure the answer, not the person/i),
      }),
    );
  });
});
