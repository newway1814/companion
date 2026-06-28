import { describe, expect, it, vi } from "vitest";

import type { AiParseResult } from "@/lib/ai/gateway";

import {
  buildReportContext,
  generateCoachingReport,
  type CoachingReport,
} from "./report";

const fixture: CoachingReport = {
  readiness: {
    band: "solid",
    score: 68,
    summary: "Solid ownership; tighten how you evidence measured results.",
  },
  answerScores: [
    {
      questionOrderIndex: 0,
      overallScore: 6.5,
      dimensions: { correctness: 7, depth: 6, ownership: 8, tradeoffs: 5, result: 4 },
      reasons: ["Clear ownership of the pipeline", "No baseline for the latency claim"],
    },
  ],
  technicalDepth: [
    { area: "Measured results", status: "incomplete", note: "Latency claim lacks a baseline." },
  ],
  claimDefenseVulnerabilities: [
    { claim: "Reduced API latency by 40%", issue: "No baseline or measurement method given." },
  ],
  suggestedReframing: [
    {
      original: "I improved performance and made it scalable.",
      improved:
        "Before the change, p99 was [baseline]; after moving to microservices it was [result], measured with [tool].",
    },
  ],
  nextPractice: {
    focus: "Quantifying impact",
    drill: "Re-answer the latency question with a baseline, method, and measured delta.",
  },
};

function parseReturning(result: CoachingReport) {
  return vi.fn(
    async (): Promise<AiParseResult<unknown>> => ({
      parsedOutput: result,
      stopReason: "STOP",
      model: "gemini-2.5-flash",
    }),
  );
}

const input = {
  targetRole: "Backend Intern",
  transcriptText:
    "Q1 (claim: Reduced API latency by 40%): I improved performance and made it scalable.",
};

describe("buildReportContext", () => {
  it("flattens questions, claims, and turns into grounded transcript text", () => {
    const context = buildReportContext({
      targetRole: "Backend Intern",
      questions: [
        {
          id: "q0",
          orderIndex: 0,
          questionText: "Walk me through the migration.",
          targetClaim: "Reduced API latency by 40%",
        },
      ],
      turns: [
        {
          questionId: "q0",
          speaker: "CANDIDATE",
          kind: "ANSWER",
          content: "I improved performance and made it scalable.",
        },
        {
          questionId: "q0",
          speaker: "INTERVIEWER",
          kind: "FOLLOW_UP",
          content: "What was the baseline?",
        },
      ],
    });

    expect(context.targetRole).toBe("Backend Intern");
    expect(context.transcriptText).toContain("Reduced API latency by 40%");
    expect(context.transcriptText).toContain("Walk me through the migration.");
    expect(context.transcriptText).toContain(
      "I improved performance and made it scalable.",
    );
    expect(context.transcriptText).toContain("What was the baseline?");
  });
});

describe("generateCoachingReport", () => {
  it("produces every required report section", async () => {
    const report = await generateCoachingReport(input, parseReturning(fixture));

    expect(["developing", "solid", "strong"]).toContain(report.readiness.band);
    expect(report.readiness.score).toBeGreaterThanOrEqual(0);
    expect(report.readiness.score).toBeLessThanOrEqual(100);
    expect(report.answerScores.length).toBeGreaterThan(0);
    expect(report.technicalDepth.length).toBeGreaterThan(0);
    expect(report.claimDefenseVulnerabilities.length).toBeGreaterThan(0);
    expect(report.suggestedReframing.length).toBeGreaterThan(0);
    expect(report.nextPractice.drill.length).toBeGreaterThan(0);
  });

  it("grounds the report in the session transcript", async () => {
    const parseFn = parseReturning(fixture);
    await generateCoachingReport(input, parseFn);

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.stringContaining("I improved performance and made it scalable."),
      }),
    );
  });

  it("frames readiness as preparation quality and forbids fabrication and hireability claims", async () => {
    const parseFn = parseReturning(fixture);
    await generateCoachingReport(input, parseFn);

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/preparation quality/i),
      }),
    );
    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/never (invent|fabricate)/i),
      }),
    );
    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/hireability|employab/i),
      }),
    );
  });
});
