export type CompletionSummary = {
  totalQuestions: number;
  questionsAnswered: number;
  /** Claim-defense issues = adaptive follow-up challenges Companion raised. */
  claimDefenseIssues: number;
  /** Challenges that asked for a baseline / measurement (a missing metric). */
  missingMetrics: number;
};

type TurnInput = {
  questionId: string;
  speaker: "INTERVIEWER" | "CANDIDATE";
  kind: "QUESTION" | "ANSWER" | "FOLLOW_UP";
  challenge?: unknown;
};

const METRIC_HINT = /baseline|measure|metric|number|quantif/i;

function chipsOf(challenge: unknown): string[] {
  if (!challenge || typeof challenge !== "object") return [];
  const chips = (challenge as { improvementChips?: unknown }).improvementChips;
  return Array.isArray(chips)
    ? chips.filter((c): c is string => typeof c === "string")
    : [];
}

/**
 * Derives the session-complete counts from the real transcript: how many of the
 * five questions were answered, how many adaptive challenges were raised
 * (claim-defense issues), and how many of those asked for a missing metric.
 */
export function buildCompletionSummary(session: {
  questions: { id: string }[];
  turns: TurnInput[];
}): CompletionSummary {
  const answered = new Set(
    session.turns
      .filter((turn) => turn.kind === "ANSWER" && turn.speaker === "CANDIDATE")
      .map((turn) => turn.questionId),
  );

  const challenges = session.turns.filter((turn) => turn.kind === "FOLLOW_UP");
  const missingMetrics = challenges.filter((turn) =>
    chipsOf(turn.challenge).some((chip) => METRIC_HINT.test(chip)),
  ).length;

  return {
    totalQuestions: session.questions.length,
    questionsAnswered: answered.size,
    claimDefenseIssues: challenges.length,
    missingMetrics,
  };
}
