import { z } from "zod";

import { runStructuredPrompt, type AiParseFn } from "@/lib/ai/gateway";
import { definePrompt } from "@/lib/ai/prompts";

/** The five-question rhythm of the flagship technical project deep-dive (CONTEXT.md). */
export const QUESTION_COUNT = 5;

const QuestionSchema = z.object({
  /** The primary question Companion will ask, in interviewer voice. */
  questionText: z.string().min(1),
  /** What this question is trying to test (used to steer follow-ups). */
  objective: z.string().min(1),
  /** The resume claim this question pressure-tests (shown as the target claim). */
  targetClaim: z.string().min(1),
  /** Concrete evaluation criteria a strong answer should satisfy. */
  rubric: z.array(z.string().min(1)).min(1),
});

export const InterviewPlanSchema = z.object({
  questions: z.array(QuestionSchema).length(QUESTION_COUNT),
});

export type InterviewPlan = z.infer<typeof InterviewPlanSchema>;
export type InterviewPlanQuestion = z.infer<typeof QuestionSchema>;

const buildPlannerPrompt = definePrompt<{
  resumeContext: string;
  roleContext: string;
}>({
  id: "interview-plan-technical-project-deep-dive",
  version: 1,
  system: `You are the InterviewPlannerAgent for Companion's flagship technical project deep-dive.

Produce EXACTLY ${QUESTION_COUNT} primary questions for a roughly 10-12 minute speech-first practice session. The session pressure-tests whether the candidate can defend their resume project claims with ownership, implementation detail, tradeoffs, baselines, and measured results.

For each question:
- questionText: a single, direct interviewer question grounded in the candidate's resume projects and the target role's requirements. Prefer evidence-seeking questions over trivia.
- objective: one sentence naming what the question tests (e.g. ownership, baseline/measured result, tradeoff reasoning, implementation depth).
- targetClaim: the specific resume claim this question pressure-tests, quoted closely from the resume context (e.g. "Reduced API latency by 40%").
- rubric: 1-4 concrete criteria a strong spoken answer should satisfy (the required evidence).

Sequence the questions to flow like a real interview: open broad on a project, then drill into ownership, evidence/metrics, tradeoffs, and reflection. Ground every question in facts from the resume context and target role; do not invent projects or numbers.

This is a technical PROJECT deep-dive, not a system-design or coding round. Pressure the answer, never the person. NEVER predict whether the candidate will be hired, and never judge them as employable or unemployable. Return JSON.`,
  buildUser: ({ resumeContext, roleContext }) =>
    `Resume context:\n${resumeContext}\n\nTarget role:\n${roleContext}`,
});

/**
 * Runs the InterviewPlannerAgent to produce the ordered five-question plan,
 * grounded in the resume and target role. The schema enforces exactly five
 * questions, so a short or malformed plan triggers the gateway's retry/validation.
 */
export function generateInterviewPlan(
  input: { resumeContext: string; roleContext: string },
  parseFn?: AiParseFn,
): Promise<InterviewPlan> {
  return runStructuredPrompt(
    { prompt: buildPlannerPrompt(input), schema: InterviewPlanSchema },
    parseFn,
  );
}
