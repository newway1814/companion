import { describe, expect, it } from "vitest";

import { buildCompletionSummary } from "./summary";

const questions = Array.from({ length: 5 }, (_, i) => ({ id: `q${i}` }));

function answer(questionId: string) {
  return {
    questionId,
    speaker: "CANDIDATE" as const,
    kind: "ANSWER" as const,
    challenge: null,
  };
}

function challenge(questionId: string, chips: string[]) {
  return {
    questionId,
    speaker: "INTERVIEWER" as const,
    kind: "FOLLOW_UP" as const,
    challenge: { improvementChips: chips },
  };
}

describe("buildCompletionSummary", () => {
  it("counts answered questions out of the total", () => {
    const summary = buildCompletionSummary({
      questions,
      turns: questions.map((q) => answer(q.id)),
    });

    expect(summary.totalQuestions).toBe(5);
    expect(summary.questionsAnswered).toBe(5);
  });

  it("counts claim-defense issues from challenges raised", () => {
    const summary = buildCompletionSummary({
      questions,
      turns: [
        answer("q0"),
        challenge("q0", ["Add a tradeoff"]),
        answer("q1"),
        challenge("q1", ["Add a baseline"]),
      ],
    });

    expect(summary.claimDefenseIssues).toBe(2);
  });

  it("counts missing metrics from challenges that ask for a baseline/measurement", () => {
    const summary = buildCompletionSummary({
      questions,
      turns: [
        challenge("q0", ["Add a baseline", "Add a measurement method"]),
        challenge("q1", ["Add a tradeoff"]),
      ],
    });

    expect(summary.missingMetrics).toBe(1);
  });
});
