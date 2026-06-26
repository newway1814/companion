/**
 * The InterviewerAgent's session-flow decision. Given the persisted plan and
 * the transcript so far, it decides the next interviewer action: ask the first
 * unanswered primary question, or — once all five are answered — complete the
 * session. The questions themselves are the InterviewerAgent's grounded plan
 * (generated through the AI gateway's safety layer at planning time), so this
 * progression never surfaces ungrounded or unsafe copy.
 *
 * Adaptive follow-up pressure is a separate slice (the live challenge moment);
 * this owns the primary-question progression and completion only.
 */

type QuestionInput = {
  id: string;
  orderIndex: number;
  questionText: string;
};

type TurnInput = {
  questionId: string;
  speaker: "INTERVIEWER" | "CANDIDATE";
  kind: "QUESTION" | "ANSWER" | "FOLLOW_UP";
  orderIndex: number;
};

/** Adaptive follow-ups allowed per question (CONTEXT.md: one or two). */
export const FOLLOW_UP_CAP = 1;

export type InterviewerAction<Q extends QuestionInput = QuestionInput> =
  | { type: "ask"; questionIndex: number; question: Q }
  | { type: "complete" };

/** How many adaptive follow-ups have already been asked for a question. */
export function countFollowUps(turns: TurnInput[], questionId: string): number {
  return turns.filter(
    (turn) => turn.questionId === questionId && turn.kind === "FOLLOW_UP",
  ).length;
}

/**
 * A question is resolved once the candidate's most recent turn for it is an
 * answer and no follow-up is pending — i.e. its last turn is a candidate
 * answer. A trailing follow-up turn means Companion is still waiting on the
 * candidate, so the question stays active.
 */
function isResolved(questionId: string, turns: TurnInput[]): boolean {
  const own = turns
    .filter((turn) => turn.questionId === questionId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const last = own[own.length - 1];
  return last != null && last.speaker === "CANDIDATE" && last.kind === "ANSWER";
}

export function nextInterviewerAction<Q extends QuestionInput>(session: {
  questions: Q[];
  turns: TurnInput[];
}): InterviewerAction<Q> {
  const questions = [...session.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const questionIndex = questions.findIndex(
    (question) => !isResolved(question.id, session.turns),
  );

  if (questionIndex === -1) return { type: "complete" };
  return { type: "ask", questionIndex, question: questions[questionIndex] };
}
