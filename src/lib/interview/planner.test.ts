import { describe, expect, it, vi } from "vitest";

import type { AiParseResult } from "@/lib/ai/gateway";

import {
  generateInterviewPlan,
  InterviewPlanSchema,
  type InterviewPlan,
} from "./planner";

const fixture: InterviewPlan = {
  questions: [
    {
      questionText: "Walk me through the realtime pipeline you built.",
      objective: "Test ownership of the core architecture decision.",
      targetClaim: "Built a realtime data pipeline",
      rubric: ["Names personal contribution", "Explains a tradeoff"],
    },
    {
      questionText: "What was the latency before and after your change?",
      objective: "Probe for a baseline and a measured result.",
      targetClaim: "Reduced API latency by 40%",
      rubric: ["Gives a baseline", "Gives a measured delta"],
    },
    {
      questionText: "How did you evaluate feedback quality?",
      objective: "Test depth of the evaluation method.",
      targetClaim: "Improved feedback quality",
      rubric: ["Describes a concrete method"],
    },
    {
      questionText: "Which part did you implement yourself?",
      objective: "Clarify ownership on a 'we' claim.",
      targetClaim: "We shipped the recommendation engine",
      rubric: ["Separates personal work from the team"],
    },
    {
      questionText: "What would you change about the design now?",
      objective: "Test self-aware tradeoff reasoning.",
      targetClaim: "Designed the caching layer",
      rubric: ["Names a concrete tradeoff or limitation"],
    },
  ],
};

function parseReturning(result: InterviewPlan) {
  return vi.fn(
    async (): Promise<AiParseResult<unknown>> => ({
      parsedOutput: result,
      stopReason: "STOP",
      model: "gemini-2.5-flash",
    }),
  );
}

describe("generateInterviewPlan", () => {
  it("returns exactly five questions, each with an objective and rubric", async () => {
    const result = await generateInterviewPlan(
      { resumeContext: "…resume…", roleContext: "…role…" },
      parseReturning(fixture),
    );

    expect(result.questions).toHaveLength(5);
    for (const question of result.questions) {
      expect(question.objective.length).toBeGreaterThan(0);
      expect(question.rubric.length).toBeGreaterThan(0);
      expect(question.targetClaim.length).toBeGreaterThan(0);
    }
  });

  it("grounds the plan in the resume and target role", async () => {
    const parseFn = parseReturning(fixture);
    await generateInterviewPlan(
      {
        resumeContext: "Claim: Pub/sub latency work",
        roleContext: "Requirement: Distributed systems",
      },
      parseFn,
    );

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.stringContaining("Pub/sub latency work"),
      }),
    );
    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.stringContaining("Distributed systems"),
      }),
    );
  });

  it("instructs the model to make no hireability claims and stay a project deep-dive", async () => {
    const parseFn = parseReturning(fixture);
    await generateInterviewPlan(
      { resumeContext: "…", roleContext: "…" },
      parseFn,
    );

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/never predict.*hired|employable/i),
      }),
    );
    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/project deep-dive/i),
      }),
    );
  });

  it("strips any chain-of-thought / reasoning from model output (contract)", () => {
    const raw = {
      questions: fixture.questions.map((question) => ({
        ...question,
        // Fields the evidence panel must never surface, even if a model emits them.
        reasoning: "Internally I suspect the candidate is weak here.",
        chainOfThought: "Step 1… step 2…",
      })),
    };

    const parsed = InterviewPlanSchema.parse(raw);

    expect(parsed.questions[0]).not.toHaveProperty("reasoning");
    expect(parsed.questions[0]).not.toHaveProperty("chainOfThought");
    // No reasoning/chain-of-thought *fields* survive (objective text may
    // legitimately contain the word "reasoning").
    expect(JSON.stringify(parsed)).not.toMatch(/"reasoning":|"chainOfThought":/i);
  });
});
