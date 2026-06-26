import { describe, expect, it } from "vitest";

import { buildRoomView } from "./room-view";

const session = {
  status: "PLANNED" as const,
  mode: "technical-project-deep-dive",
  questions: [
    { orderIndex: 0, questionText: "Walk me through the realtime pipeline." },
    { orderIndex: 1, questionText: "What was the latency before and after?" },
    { orderIndex: 2, questionText: "Which part did you build yourself?" },
    { orderIndex: 3, questionText: "How did you evaluate quality?" },
    { orderIndex: 4, questionText: "What would you change now?" },
  ],
};

describe("buildRoomView", () => {
  it("derives session type, n-of-5 progress, and the current question", () => {
    const view = buildRoomView(session);

    expect(view.sessionType).toBe("Project Deep-Dive");
    expect(view.totalQuestions).toBe(5);
    expect(view.currentIndex).toBe(0);
    expect(view.currentQuestion?.text).toBe(
      "Walk me through the realtime pipeline.",
    );
    expect(view.interviewerRole).toBe("Senior Engineer");
    expect(view.statusLabel).toBe("Ready");
    expect(view.timingLabel).toMatch(/10–12 min/);
  });

  it("marks the current question active and later ones upcoming", () => {
    const view = buildRoomView(session);

    expect(view.timeline).toHaveLength(5);
    expect(view.timeline[0].state).toBe("active");
    expect(view.timeline[1].state).toBe("upcoming");
    expect(view.timeline[4].state).toBe("upcoming");
  });
});
