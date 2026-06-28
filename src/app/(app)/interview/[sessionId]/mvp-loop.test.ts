import { describe, expect, it, vi } from "vitest";

import type { AiParseResult } from "@/lib/ai/gateway";
import { findSafetyViolations } from "@/lib/ai/safety";
import { analyzeAnswer, type ChallengeAnalysis } from "@/lib/interview/challenge";
import {
  countFollowUps,
  FOLLOW_UP_CAP,
  nextInterviewerAction,
} from "@/lib/interview/interviewer";
import { generateInterviewPlan, type InterviewPlan } from "@/lib/interview/planner";
import { generateCoachingReport, type CoachingReport } from "@/lib/interview/report";

import { buildCompletionSummary } from "./complete/summary";
import { buildRoomView } from "./room-view";

/**
 * Product-boundary test (#23): drives the whole MVP loop through the real domain
 * modules with stubbed AI, so the happy path + adaptive challenge are protected
 * against regressions deterministically (no live model calls).
 */

function parseReturning<T>(result: T) {
  return vi.fn(
    async (): Promise<AiParseResult<unknown>> => ({
      parsedOutput: result,
      stopReason: "STOP",
      model: "gemini-2.5-flash",
    }),
  );
}

const planFixture: InterviewPlan = {
  questions: Array.from({ length: 5 }, (_, i) => ({
    questionText: `Question ${i}: walk me through project ${i}.`,
    objective: `Probe ownership and evidence for project ${i}.`,
    targetClaim: i === 0 ? "Reduced API latency by 40%" : `Built project ${i}`,
    rubric: ["Gives a baseline", "Names a tradeoff"],
  })),
};

const vagueChallenge: ChallengeAnalysis = {
  shouldChallenge: true,
  challengedClaim: "Reduced API latency by 40%",
  reason: "You said performance improved, but an interviewer wants the baseline.",
  weakSpan: "I improved performance and made it scalable.",
  improvementChips: ["Add a baseline", "Add a measurement method"],
  followUpQuestion: "What was the baseline latency, and how did you measure the 40%?",
};

const reportFixture: CoachingReport = {
  readiness: { band: "solid", score: 66, summary: "Solid; tighten measured results." },
  answerScores: [
    {
      questionOrderIndex: 0,
      overallScore: 6,
      dimensions: { correctness: 7, depth: 6, ownership: 8, tradeoffs: 5, result: 4 },
      reasons: ["Clear ownership", "No baseline for the latency claim"],
    },
  ],
  technicalDepth: [
    { area: "Measured results", status: "incomplete", note: "Latency claim lacks a baseline." },
  ],
  claimDefenseVulnerabilities: [
    { claim: "Reduced API latency by 40%", issue: "No baseline or method." },
  ],
  suggestedReframing: [
    { original: "I improved performance.", improved: "Before, p99 was [baseline]; after, [result]." },
  ],
  nextPractice: { focus: "Metrics", drill: "Re-answer with a baseline and measured delta." },
};

type Turn = {
  questionId: string;
  speaker: "INTERVIEWER" | "CANDIDATE";
  kind: "QUESTION" | "ANSWER" | "FOLLOW_UP";
  content: string;
  orderIndex: number;
  challenge?: unknown;
};

describe("MVP loop (product boundary)", () => {
  it("runs the happy path with one adaptive challenge to completion and a full report", async () => {
    // 1. Plan: exactly five grounded questions.
    const plan = await generateInterviewPlan(
      { resumeContext: "…resume…", roleContext: "…role…" },
      parseReturning(planFixture),
    );
    expect(plan.questions).toHaveLength(5);

    const questions = plan.questions.map((q, i) => ({
      id: `q${i}`,
      orderIndex: i,
      questionText: q.questionText,
      objective: q.objective,
      targetClaim: q.targetClaim,
      rubric: q.rubric,
    }));

    const turns: Turn[] = [];
    const answer = (questionId: string, content: string) =>
      turns.push({
        questionId,
        speaker: "CANDIDATE",
        kind: "ANSWER",
        content,
        orderIndex: turns.length,
        challenge: null,
      });

    // 2. Interviewer asks the first question.
    expect(nextInterviewerAction({ questions, turns })).toMatchObject({
      type: "ask",
      questionIndex: 0,
    });

    // 3. Candidate gives a vague answer → adaptive challenge references the claim.
    answer("q0", "I improved performance and made it scalable.");
    const analysis = await analyzeAnswer(
      {
        questionText: questions[0].questionText,
        objective: questions[0].objective,
        targetClaim: questions[0].targetClaim,
        requiredEvidence: questions[0].rubric,
        answer: "I improved performance and made it scalable.",
      },
      parseReturning(vagueChallenge),
    );
    expect(analysis.shouldChallenge).toBe(true);
    expect(analysis.challengedClaim).toBe("Reduced API latency by 40%");

    turns.push({
      questionId: "q0",
      speaker: "INTERVIEWER",
      kind: "FOLLOW_UP",
      content: analysis.followUpQuestion,
      orderIndex: turns.length,
      challenge: {
        reason: analysis.reason,
        weakSpan: analysis.weakSpan,
        challengedClaim: analysis.challengedClaim,
        improvementChips: analysis.improvementChips,
      },
    });

    // 4. The room surfaces the live challenge, still on Q1, referencing the claim.
    const challenged = buildRoomView({
      status: "IN_PROGRESS",
      mode: "technical-project-deep-dive",
      questions,
      turns,
    });
    expect(challenged.currentIndex).toBe(0);
    expect(challenged.challenge?.challengedClaim).toBe("Reduced API latency by 40%");
    expect(challenged.challenge?.improvementChips).toContain("Add a baseline");

    // 5. The per-question follow-up cap is respected: one follow-up, then advance.
    expect(countFollowUps(turns, "q0")).toBe(FOLLOW_UP_CAP);
    answer("q0", "Baseline was 200ms; after the change it was 120ms, measured with k6.");
    expect(nextInterviewerAction({ questions, turns })).toMatchObject({
      type: "ask",
      questionIndex: 1,
    });

    // 6. Answer the remaining questions to completion.
    for (let i = 1; i < 5; i++) {
      answer(`q${i}`, `Concrete answer for project ${i} with a measured result.`);
    }
    expect(nextInterviewerAction({ questions, turns })).toEqual({ type: "complete" });

    // 7. Completion summary reflects real state: 5 answered, one claim-defense issue.
    const summary = buildCompletionSummary({ questions, turns });
    expect(summary.questionsAnswered).toBe(5);
    expect(summary.claimDefenseIssues).toBe(1);
    expect(summary.missingMetrics).toBe(1);

    // 8. Coaching report has every required section and is safety-clean.
    const report = await generateCoachingReport(
      { targetRole: "Backend Intern", transcriptText: "…transcript…" },
      parseReturning(reportFixture),
    );
    expect(["developing", "solid", "strong"]).toContain(report.readiness.band);
    expect(report.answerScores.length).toBeGreaterThan(0);
    expect(report.technicalDepth.length).toBeGreaterThan(0);
    expect(report.claimDefenseVulnerabilities.length).toBeGreaterThan(0);
    expect(report.suggestedReframing.length).toBeGreaterThan(0);
    expect(report.nextPractice.drill.length).toBeGreaterThan(0);
    expect(findSafetyViolations(JSON.stringify(report))).toEqual([]);
  });

  it("blocks hireability and protected-trait language anywhere in generated copy", () => {
    // The boundary that protects every agent's output (gateway safety layer).
    expect(findSafetyViolations("You are clearly unhireable for this role.").length).toBeGreaterThan(0);
    expect(findSafetyViolations("I would recommend hiring this candidate.").length).toBeGreaterThan(0);
    expect(findSafetyViolations("Your age makes this difficult.").length).toBeGreaterThan(0);
    expect(findSafetyViolations("Add a baseline and a measured result.")).toEqual([]);
  });
});
