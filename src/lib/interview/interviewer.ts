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
};

export type InterviewerAction<Q extends QuestionInput = QuestionInput> =
  | { type: "ask"; questionIndex: number; question: Q }
  | { type: "complete" };

export function nextInterviewerAction<Q extends QuestionInput>(session: {
  questions: Q[];
  turns: TurnInput[];
}): InterviewerAction<Q> {
  const questions = [...session.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const answeredQuestionIds = new Set(
    session.turns
      .filter((turn) => turn.kind === "ANSWER" && turn.speaker === "CANDIDATE")
      .map((turn) => turn.questionId),
  );

  const questionIndex = questions.findIndex(
    (question) => !answeredQuestionIds.has(question.id),
  );

  if (questionIndex === -1) return { type: "complete" };
  return { type: "ask", questionIndex, question: questions[questionIndex] };
}
