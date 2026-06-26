import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { ChallengeBanner } from "./challenge-banner";
import type { ChallengeView } from "./room-view";

const challenge: ChallengeView = {
  challengedClaim: "Reduced API latency by 40%",
  reason:
    "You said performance improved, but an interviewer will want the baseline and how you measured it.",
  weakSpan: "I improved performance and made it scalable.",
  improvementChips: ["Add a baseline", "Add a measurement method", "Add a tradeoff"],
  followUpQuestion:
    "What was the original latency baseline, and how did you measure the 40% reduction?",
};

describe("ChallengeBanner", () => {
  it("shows the challenge label, follow-up, reason, claim, and weak span", () => {
    render(<ChallengeBanner challenge={challenge} />);

    expect(screen.getByText(/^challenge$/i)).toBeInTheDocument();
    expect(screen.getByText(/original latency baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/an interviewer will want the baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/reduced api latency by 40%/i)).toBeInTheDocument();
    expect(
      screen.getByText(/i improved performance and made it scalable\./i),
    ).toBeInTheDocument();
  });

  it("announces the challenge reason to screen readers", () => {
    render(<ChallengeBanner challenge={challenge} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      /an interviewer will want the baseline/i,
    );
  });

  it("offers improvement chips as buttons that report which was used", async () => {
    const onUseChip = vi.fn();
    render(<ChallengeBanner challenge={challenge} onUseChip={onUseChip} />);

    const chip = screen.getByRole("button", { name: /add a baseline/i });
    await userEvent.click(chip);

    expect(onUseChip).toHaveBeenCalledWith("Add a baseline");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ChallengeBanner challenge={challenge} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
