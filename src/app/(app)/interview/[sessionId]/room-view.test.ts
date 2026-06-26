import { describe, expect, it } from "vitest";

import { buildRoomView } from "./room-view";

function question(
  id: string,
  orderIndex: number,
  questionText: string,
  extra: Partial<{ objective: string; targetClaim: string; rubric: string[] }> = {},
) {
  return {
    id,
    orderIndex,
    questionText,
    objective: extra.objective ?? `Objective ${orderIndex}`,
    targetClaim: extra.targetClaim ?? `Claim ${orderIndex}`,
    rubric: extra.rubric ?? ["Gives a baseline", "Names a tradeoff"],
  };
}

const questions = [
  question("q0", 0, "Walk me through the realtime pipeline.", {
    objective: "Test ownership of the architecture.",
    targetClaim: "Built a realtime data pipeline",
    rubric: ["Names personal contribution", "Explains a tradeoff"],
  }),
  question("q1", 1, "What was the latency before and after?"),
  question("q2", 2, "Which part did you build yourself?"),
  question("q3", 3, "How did you evaluate quality?"),
  question("q4", 4, "What would you change now?"),
];

const baseSession = {
  status: "IN_PROGRESS" as const,
  mode: "technical-project-deep-dive",
  questions,
};

describe("buildRoomView", () => {
  it("derives session type, n-of-5 progress, and the current question", () => {
    const view = buildRoomView({ ...baseSession, turns: [] });

    expect(view.sessionType).toBe("Project Deep-Dive");
    expect(view.totalQuestions).toBe(5);
    expect(view.currentIndex).toBe(0);
    expect(view.currentQuestion?.text).toBe(
      "Walk me through the realtime pipeline.",
    );
    expect(view.interviewerRole).toBe("Senior Engineer");
    expect(view.statusLabel).toBe("In progress");
    expect(view.timingLabel).toMatch(/10–12 min/);
  });

  it("starts with the first question active and the rest upcoming", () => {
    const view = buildRoomView({ ...baseSession, turns: [] });

    expect(view.timeline).toHaveLength(5);
    expect(view.timeline[0].state).toBe("active");
    expect(view.timeline[1].state).toBe("upcoming");
    expect(view.timeline[4].state).toBe("upcoming");
    expect(view.timeline.every((item) => item.turns.length === 0)).toBe(true);
  });

  it("advances the active marker once a question is answered", () => {
    const view = buildRoomView({
      ...baseSession,
      turns: [
        {
          questionId: "q0",
          speaker: "CANDIDATE",
          kind: "ANSWER",
          content: "I owned the ingestion path end to end.",
          orderIndex: 0,
        },
      ],
    });

    expect(view.timeline[0].state).toBe("done");
    expect(view.timeline[1].state).toBe("active");
    expect(view.currentIndex).toBe(1);
    expect(view.currentQuestion?.text).toBe(
      "What was the latency before and after?",
    );
  });

  it("builds the evidence panel for the active question without leaking internals", () => {
    const view = buildRoomView({ ...baseSession, turns: [] });

    expect(view.evidence.targetClaim).toBe("Built a realtime data pipeline");
    expect(view.evidence.probingFocus).toBe("Test ownership of the architecture.");
    expect(view.evidence.requiredEvidence.map((item) => item.label)).toEqual([
      "Names personal contribution",
      "Explains a tradeoff",
    ]);
    // Nothing is satisfied before the answer is evaluated (scoring is a later slice).
    expect(view.evidence.requiredEvidence.every((item) => !item.satisfied)).toBe(true);
    expect(view.evidence.notes.length).toBeGreaterThan(0);
  });

  it("advances the evidence panel to the next question's claim once answered", () => {
    const view = buildRoomView({
      ...baseSession,
      turns: [
        {
          questionId: "q0",
          speaker: "CANDIDATE",
          kind: "ANSWER",
          content: "I owned it.",
          orderIndex: 0,
        },
      ],
    });

    expect(view.evidence.targetClaim).toBe("Claim 1");
  });

  it("nests answers and follow-ups as turns under their question, in order", () => {
    const view = buildRoomView({
      ...baseSession,
      turns: [
        {
          questionId: "q0",
          speaker: "CANDIDATE",
          kind: "ANSWER",
          content: "I built the ingestion path.",
          orderIndex: 0,
        },
        {
          questionId: "q0",
          speaker: "INTERVIEWER",
          kind: "FOLLOW_UP",
          content: "Which part did you personally write?",
          orderIndex: 1,
        },
      ],
    });

    const first = view.timeline[0];
    expect(first.turns.map((t) => t.content)).toEqual([
      "I built the ingestion path.",
      "Which part did you personally write?",
    ]);
    expect(first.turns[0].speaker).toBe("You");
    expect(first.turns[1].speaker).toBe("Interviewer");
  });
});
