import { z } from "zod";

import { runStructuredPrompt, type AiParseFn } from "@/lib/ai/gateway";
import { definePrompt } from "@/lib/ai/prompts";

export const ChallengeAnalysisSchema = z.object({
  /** Whether the answer is vague/unsupported enough to warrant a follow-up. */
  shouldChallenge: z.boolean(),
  /** The exact resume claim or role requirement being challenged ("" if none). */
  challengedClaim: z.string(),
  /** A respectful, user-facing reason for the challenge ("" if none). */
  reason: z.string(),
  /** The verbatim vague span from the answer to highlight ("" if none). */
  weakSpan: z.string(),
  /** Improvement prompts, e.g. "Add a baseline" (empty if not challenging). */
  improvementChips: z.array(z.string()),
  /** A single evidence-seeking follow-up question ("" if not challenging). */
  followUpQuestion: z.string(),
});

export type ChallengeAnalysis = z.infer<typeof ChallengeAnalysisSchema>;

const buildChallengePrompt = definePrompt<{
  questionText: string;
  objective: string;
  targetClaim: string;
  requiredEvidence: string[];
  answer: string;
}>({
  id: "interview-answer-challenge",
  version: 1,
  system: `You are the InterviewerAgent deciding whether to ask one adaptive follow-up.

Judge ONLY whether the candidate's answer supports the claim under test with concrete evidence. Challenge when the answer shows: a vague claim, a missing metric/baseline/measurement method, unclear ownership ("we" with no personal role), shallow implementation detail, or a role-fit gap. If the answer already gives specific, defensible evidence, do NOT challenge.

When you challenge, return:
- challengedClaim: the exact resume claim or role requirement at issue, quoted closely.
- reason: one or two plain sentences explaining what evidence is missing and why an interviewer would push — about the ANSWER, not the candidate.
- weakSpan: the vague phrase copied verbatim from the answer.
- improvementChips: 1-3 short prompts like "Add a baseline", "Add a measurement method", "Add a tradeoff".
- followUpQuestion: a single, direct evidence-seeking follow-up.

Pressure the answer, not the person. Never insult, shame, or judge the candidate. Never predict employability or hireability. Never infer protected traits. If shouldChallenge is false, return empty strings and an empty chips array. Return JSON.`,
  buildUser: ({ questionText, objective, targetClaim, requiredEvidence, answer }) =>
    `Question: ${questionText}\nObjective: ${objective}\nClaim under test: ${targetClaim}\nRequired evidence: ${requiredEvidence.join("; ")}\n\nCandidate answer:\n${answer}`,
});

/**
 * Runs the InterviewerAgent's adaptive-follow-up analysis over one answer.
 * Returns whether to challenge and, if so, the grounded challenge details.
 */
export function analyzeAnswer(
  input: {
    questionText: string;
    objective: string;
    targetClaim: string;
    requiredEvidence: string[];
    answer: string;
  },
  parseFn?: AiParseFn,
): Promise<ChallengeAnalysis> {
  return runStructuredPrompt(
    { prompt: buildChallengePrompt(input), schema: ChallengeAnalysisSchema },
    parseFn,
  );
}
