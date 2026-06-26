import { describe, expect, it } from "vitest";

import { findSafetyViolations } from "@/lib/ai/safety";

import { nextInterviewerAction } from "./interviewer";

function makeQuestions() {
  return Array.from({ length: 5 }, (_, index) => ({
    id: `q${index}`,
    orderIndex: index,
    questionText: `Walk me through project ${index}. What did you personally own?`,
  }));
}

function answer(questionId: string, orderIndex: number) {
  return {
    questionId,
    speaker: "CANDIDATE" as const,
    kind: "ANSWER" as const,
    orderIndex,
  };
}

describe("nextInterviewerAction", () => {
  it("asks the first unanswered question, grounded in the plan", () => {
    const action = nextInterviewerAction({ questions: makeQuestions(), turns: [] });

    expect(action).toEqual({
      type: "ask",
      questionIndex: 0,
      question: expect.objectContaining({ id: "q0" }),
    });
  });

  it("advances to the next question once the current one is answered", () => {
    const action = nextInterviewerAction({
      questions: makeQuestions(),
      turns: [answer("q0", 0)],
    });

    expect(action).toMatchObject({ type: "ask", questionIndex: 1 });
  });

  it("completes after the fifth primary question and never asks a sixth", () => {
    const questions = makeQuestions();
    const turns = questions.map((q, i) => answer(q.id, i));

    const action = nextInterviewerAction({ questions, turns });

    expect(action).toEqual({ type: "complete" });
  });

  it("walks a scripted five-answer run to completion", () => {
    const questions = makeQuestions();
    const turns: ReturnType<typeof answer>[] = [];

    let asks = 0;
    for (let guard = 0; guard < 10; guard++) {
      const action = nextInterviewerAction({ questions, turns });
      if (action.type === "complete") break;
      asks++;
      turns.push(answer(action.question.id, turns.length));
    }

    expect(asks).toBe(5);
    expect(nextInterviewerAction({ questions, turns })).toEqual({ type: "complete" });
  });

  it("only surfaces interviewer copy that passes the safety layer", () => {
    const action = nextInterviewerAction({ questions: makeQuestions(), turns: [] });

    if (action.type !== "ask") throw new Error("expected an ask");
    expect(findSafetyViolations(action.question.questionText)).toEqual([]);
  });
});
