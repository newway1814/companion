import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { SessionComplete } from "./session-complete";

const summary = {
  totalQuestions: 5,
  questionsAnswered: 5,
  claimDefenseIssues: 3,
  missingMetrics: 2,
};

describe("SessionComplete", () => {
  it("summarizes the run and the detected issue counts as text", () => {
    render(<SessionComplete sessionId="sess-1" summary={summary} />);

    expect(
      screen.getByRole("heading", { name: /interview complete/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/5-question deep-dive/i)).toBeInTheDocument();
    expect(
      screen.getByText(/3 claim-defense issues/i, { selector: "strong" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2 missing metrics/i, { selector: "strong" }),
    ).toBeInTheDocument();
  });

  it("routes to the coaching report for this session", () => {
    render(<SessionComplete sessionId="sess-1" summary={summary} />);

    expect(
      screen.getByRole("link", { name: /view coaching report/i }),
    ).toHaveAttribute("href", "/interview/sess-1/report");
  });

  it("offers practice again, which starts a new session setup", () => {
    render(<SessionComplete sessionId="sess-1" summary={summary} />);

    expect(
      screen.getByRole("link", { name: /practice again/i }),
    ).toHaveAttribute("href", "/setup");
  });

  it("singularizes a single issue", () => {
    render(
      <SessionComplete
        sessionId="sess-1"
        summary={{ ...summary, claimDefenseIssues: 1, missingMetrics: 1 }}
      />,
    );

    expect(
      screen.getByText(/1 claim-defense issue\b/i, { selector: "strong" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/1 missing metric\b/i, { selector: "strong" }),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SessionComplete sessionId="sess-1" summary={summary} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
