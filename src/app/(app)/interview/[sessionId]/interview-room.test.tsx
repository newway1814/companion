import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { InterviewRoom } from "./interview-room";
import { buildRoomView } from "./room-view";

const view = buildRoomView({
  status: "PLANNED",
  mode: "technical-project-deep-dive",
  questions: [
    { id: "q0", orderIndex: 0, questionText: "Walk me through the realtime pipeline." },
    { id: "q1", orderIndex: 1, questionText: "What was the latency before and after?" },
    { id: "q2", orderIndex: 2, questionText: "Which part did you build yourself?" },
    { id: "q3", orderIndex: 3, questionText: "How did you evaluate quality?" },
    { id: "q4", orderIndex: 4, questionText: "What would you change now?" },
  ],
  turns: [],
});

describe("InterviewRoom shell", () => {
  it("shows the brand, session type, progress, timing, and status as text", () => {
    render(<InterviewRoom view={view} />);

    expect(screen.getByText("Companion")).toBeInTheDocument();
    expect(screen.getByText(/Project Deep-Dive/i)).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/10–12 min/)).toBeInTheDocument();
    expect(screen.getByText(/Ready/)).toBeInTheDocument();
  });

  it("shows interviewer role framing and the current question prominently", () => {
    render(<InterviewRoom view={view} />);

    const interviewer = screen.getByRole("region", { name: /interviewer/i });
    expect(interviewer).toHaveTextContent(/Senior Engineer/i);
    expect(
      screen.getByText(/Walk me through the realtime pipeline\./),
    ).toBeInTheDocument();
  });

  it("renders the three workspace regions, including reserved panels", () => {
    render(<InterviewRoom view={view} />);

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

  it("has no axe violations", async () => {
    const { container } = render(<InterviewRoom view={view} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("matches the three-area workspace composition", () => {
    const { container } = render(<InterviewRoom view={view} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
