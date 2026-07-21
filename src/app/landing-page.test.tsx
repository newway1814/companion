import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { MarketingLanding } from "./landing-page";

describe("public marketing landing page", () => {
  it("explains Companion through the complete evidence story without WebGL", () => {
    render(<MarketingLanding />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Defend the work behind your resume.",
      }),
    ).toBeInTheDocument();

    const story = screen.getByLabelText("How Companion challenges an answer");
    const beats = within(story).getAllByRole("article");
    expect(beats).toHaveLength(5);
    expect(beats.map((beat) => beat.getAttribute("data-story-beat"))).toEqual([
      "resume-enters",
      "claim-scanned",
      "question-asked",
      "gaps-flagged",
      "answer-resolves",
    ]);

    expect(
      screen.getByText(/private practice partner, not a hiring or ranking tool/i),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: "Start practicing" })) {
      expect(link).toHaveAttribute("href", "/sign-in");
    }
  });

  it("uses accessible landmarks and content when the scene is absent", async () => {
    const { container } = render(<MarketingLanding />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
