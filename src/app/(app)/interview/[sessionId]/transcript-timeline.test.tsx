import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import type { TranscriptItem } from "./room-view";
import { TranscriptTimeline } from "./transcript-timeline";

const items: TranscriptItem[] = [
  {
    orderIndex: 0,
    questionId: "q0",
    label: "Question 1",
    state: "done",
    turns: [
      { speaker: "You", kind: "ANSWER", content: "I built the ingestion path." },
      {
        speaker: "Interviewer",
        kind: "FOLLOW_UP",
        content: "Which part did you personally write?",
      },
    ],
  },
  { orderIndex: 1, questionId: "q1", label: "Question 2", state: "active", turns: [] },
  { orderIndex: 2, questionId: "q2", label: "Question 3", state: "upcoming", turns: [] },
];

describe("TranscriptTimeline", () => {
  it("renders the questions as a navigable list within a labelled region", () => {
    render(<TranscriptTimeline items={items} />);

    const region = screen.getByRole("region", { name: /transcript timeline/i });
    expect(within(region).getAllByRole("list").length).toBeGreaterThanOrEqual(1);
    expect(within(region).getByText("Question 1")).toBeInTheDocument();
    expect(within(region).getByText("Question 3")).toBeInTheDocument();
  });

  it("conveys completed/active/upcoming with text, not colour alone", () => {
    render(<TranscriptTimeline items={items} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("shows answers and follow-ups as turns under their question", () => {
    render(<TranscriptTimeline items={items} />);

    expect(
      screen.getByText("I built the ingestion path."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/which part did you personally write/i),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TranscriptTimeline items={items} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
