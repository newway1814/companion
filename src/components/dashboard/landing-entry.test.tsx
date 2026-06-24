import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LandingEntry } from "./landing-entry";

describe("LandingEntry", () => {
  it("makes 'Start project deep-dive' the dominant action linking into setup", () => {
    render(<LandingEntry />);

    expect(
      screen.getByRole("link", { name: /start project deep-dive/i }),
    ).toHaveAttribute("href", "/setup");
  });

  it("links to previous sessions in history", () => {
    render(<LandingEntry />);

    expect(
      screen.getByRole("link", { name: /previous sessions/i }),
    ).toHaveAttribute("href", "/sessions");
  });

  it("shows an empty previous-sessions state when there is no history", () => {
    render(<LandingEntry />);

    expect(screen.getByText(/no practice sessions yet/i)).toBeInTheDocument();
  });

  it("keeps claim-defense framing and private-by-default reassurance", () => {
    render(<LandingEntry />);

    expect(
      screen.getByRole("heading", { name: /defending your software project claims/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/private by default/i)).toBeInTheDocument();
  });
});
