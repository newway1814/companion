import { z } from "zod";

import { runStructuredPrompt, type AiParseFn } from "@/lib/ai/gateway";
import { definePrompt } from "@/lib/ai/prompts";

const AnswerScoreSchema = z.object({
  questionOrderIndex: z.number().int().min(0),
  /** Overall answer score, 0-10. */
  overallScore: z.number().min(0).max(10),
  /** Technical project deep-dive rubric dimensions, each 0-10. */
  dimensions: z.object({
    correctness: z.number().min(0).max(10),
    depth: z.number().min(0).max(10),
    ownership: z.number().min(0).max(10),
    tradeoffs: z.number().min(0).max(10),
    result: z.number().min(0).max(10),
  }),
  /** Concise, transcript-grounded reasons for the score. */
  reasons: z.array(z.string()),
});

export const CoachingReportSchema = z.object({
  /** Overall readiness: a qualitative band plus a 0-100 preparation score. */
  readiness: z.object({
    band: z.enum(["developing", "solid", "strong"]),
    score: z.number().int().min(0).max(100),
    summary: z.string(),
  }),
  answerScores: z.array(AnswerScoreSchema),
  technicalDepth: z.array(
    z.object({
      area: z.string(),
      status: z.enum(["verified", "incomplete", "missing"]),
      note: z.string(),
    }),
  ),
  claimDefenseVulnerabilities: z.array(
    z.object({ claim: z.string(), issue: z.string() }),
  ),
  suggestedReframing: z.array(
    z.object({ original: z.string(), improved: z.string() }),
  ),
  nextPractice: z.object({ focus: z.string(), drill: z.string() }),
});

export type CoachingReport = z.infer<typeof CoachingReportSchema>;
export type ReadinessBand = CoachingReport["readiness"]["band"];

const SPEAKER_LABELS: Record<"INTERVIEWER" | "CANDIDATE", string> = {
  INTERVIEWER: "Interviewer",
  CANDIDATE: "You",
};

/**
 * Flattens a finished session into grounded transcript text for the report
 * agent: each question with the claim under test, then its turns in order.
 */
export function buildReportContext(input: {
  targetRole: string;
  questions: {
    id: string;
    orderIndex: number;
    questionText: string;
    targetClaim: string;
  }[];
  turns: {
    questionId: string;
    speaker: "INTERVIEWER" | "CANDIDATE";
    kind: "QUESTION" | "ANSWER" | "FOLLOW_UP";
    content: string;
  }[];
}): { targetRole: string; transcriptText: string } {
  const questions = [...input.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const blocks = questions.map((question, index) => {
    const lines = [
      `Q${index + 1} (claim: ${question.targetClaim}): ${question.questionText}`,
    ];
    for (const turn of input.turns.filter((t) => t.questionId === question.id)) {
      lines.push(`  [${SPEAKER_LABELS[turn.speaker]}] ${turn.content}`);
    }
    return lines.join("\n");
  });

  return {
    targetRole: input.targetRole,
    transcriptText: blocks.join("\n\n"),
  };
}

const buildReportPrompt = definePrompt<{
  targetRole: string;
  transcriptText: string;
}>({
  id: "coaching-report",
  version: 1,
  system: `You are Companion's ScoringAgent, FeedbackCoachAgent, and ReportGeneratorAgent combined. From the practice-session transcript, produce a structured coaching report for a technical project deep-dive.

- answerScores: score each answered question on the rubric — correctness, depth, ownership, tradeoffs, result — each 0-10, plus an overall 0-10 and 1-3 concise reasons grounded in what the candidate actually said.
- readiness: an overall readiness band (developing | solid | strong) and a 0-100 score. Readiness means PREPARATION QUALITY for this interview mode — how well the candidate can currently defend their claims — NOT a hiring outcome.
- technicalDepth: per area, a status of verified | incomplete | missing with a short note.
- claimDefenseVulnerabilities: resume claims the candidate could not fully defend, each with the specific issue (e.g. missing baseline).
- suggestedReframing: for weak answers, the original answer and an improved structure. Improved rewrites add structure and ask for evidence with placeholders like "[baseline]" — NEVER invent metrics, results, or experience the candidate did not state.
- nextPractice: one focus area and one concrete drill.

Score only the answers, never the person. Frame readiness as preparation quality, not hireability. Never predict employability/hireability, never recommend for or against hiring, never compare the candidate to others, and never infer protected traits. Return JSON.`,
  buildUser: ({ targetRole, transcriptText }) =>
    `Target role: ${targetRole}\n\nSession transcript:\n${transcriptText}`,
});

/**
 * Runs the combined scoring + coaching report agent over a finished session's
 * transcript and returns a validated, schema-safe coaching report.
 */
export function generateCoachingReport(
  input: { targetRole: string; transcriptText: string },
  parseFn?: AiParseFn,
): Promise<CoachingReport> {
  return runStructuredPrompt(
    { prompt: buildReportPrompt(input), schema: CoachingReportSchema },
    parseFn,
  );
}
