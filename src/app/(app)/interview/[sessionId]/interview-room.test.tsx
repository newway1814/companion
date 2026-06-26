import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { InterviewRoom } from "./interview-room";
import { buildRoomView } from "./room-view";
import type { SubmitAnswerState } from "./types";

function question(id: string, orderIndex: number, questionText: string, targetClaim: string) {
  return {
    id,
    orderIndex,
    questionText,
    objective: `Objective ${orderIndex}`,
    targetClaim,
    rubric: ["Gives a baseline", "Names a tradeoff"],
  };
}

const questions = [
  question("q0", 0, "Walk me through the realtime pipeline.", "Built a realtime pipeline"),
  question("q1", 1, "What was the latency before and after?", "Reduced API latency by 40%"),
  question("q2", 2, "Which part did you build yourself?", "Shipped the recommender"),
  question("q3", 3, "How did you evaluate quality?", "Improved feedback quality"),
  question("q4", 4, "What would you change now?", "Designed the caching layer"),
];

const view = buildRoomView({
  status: "PLANNED",
  mode: "technical-project-deep-dive",
  questions,
  turns: [],
});

const noopAction = vi.fn(async (): Promise<SubmitAnswerState> => null);

function renderRoom(roomView = view) {
  return render(
    <InterviewRoom
      view={roomView}
      sessionId="sess-1"
      submitAction={noopAction}
    />,
  );
}

describe("InterviewRoom shell", () => {
  it("shows the brand, session type, progress, timing, and status as text", () => {
    renderRoom();

    expect(screen.getByText("Companion")).toBeInTheDocument();
    expect(screen.getByText(/Project Deep-Dive/i)).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/10–12 min/)).toBeInTheDocument();
    expect(screen.getByText(/Ready/)).toBeInTheDocument();
  });

  it("shows interviewer role framing and the current question prominently", () => {
    renderRoom();

    const interviewer = screen.getByRole("region", { name: /interviewer/i });
    expect(interviewer).toHaveTextContent(/Senior Engineer/i);
    expect(
      screen.getByText(/Walk me through the realtime pipeline\./),
    ).toBeInTheDocument();
  });

  it("renders the three workspace regions, including reserved panels", () => {
    renderRoom();

    expect(
      screen.getByRole("region", { name: /interviewer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /your answer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: /evidence and notes/i }),
    ).toBeInTheDocument();
  });

  it("shows the active question's target claim in the evidence panel", () => {
    renderRoom();

    const evidence = screen.getByRole("complementary", {
      name: /evidence and notes/i,
    });
    expect(
      within(evidence).getByText(/built a realtime pipeline/i),
    ).toBeInTheDocument();
    expect(within(evidence).getByText(/target claim/i)).toBeInTheDocument();
  });

  it("reflects a submitted answer as a turn in the transcript timeline", () => {
    const answered = buildRoomView({
      status: "IN_PROGRESS",
      mode: "technical-project-deep-dive",
      questions,
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
    renderRoom(answered);

    const timeline = screen.getByRole("region", { name: /transcript timeline/i });
    expect(
      within(timeline).getByText(/i owned the ingestion path end to end\./i),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderRoom();

    expect(await axe(container)).toHaveNoViolations();
  });

  it("matches the three-area workspace composition", () => {
    const { container } = renderRoom();

    expect(container.firstChild).toMatchSnapshot();
  });
});
