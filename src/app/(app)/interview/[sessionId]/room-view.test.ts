import { describe, expect, it } from "vitest";

import { buildRoomView } from "./room-view";

const questions = [
  { id: "q0", orderIndex: 0, questionText: "Walk me through the realtime pipeline." },
  { id: "q1", orderIndex: 1, questionText: "What was the latency before and after?" },
  { id: "q2", orderIndex: 2, questionText: "Which part did you build yourself?" },
  { id: "q3", orderIndex: 3, questionText: "How did you evaluate quality?" },
  { id: "q4", orderIndex: 4, questionText: "What would you change now?" },
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
