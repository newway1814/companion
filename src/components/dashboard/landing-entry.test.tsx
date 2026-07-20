import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LandingEntry, type DashboardData } from "./landing-entry";

const ready: DashboardData = {
  resume: {
    id: "r1",
    filename: "swe_2024.pdf",
    analyzed: true,
    claimCount: 4,
    needsEvidenceCount: 2,
    topClaims: [
      { title: "Reduced API latency", verified: false, weakSpots: ["missing-baseline"] },
    ],
  },
  role: {
    id: "role1",
    title: "Backend Intern",
    company: "Acme",
    analyzed: true,
    requirementCount: 6,
  },
  sessions: [
    {
      id: "s1",
      dateLabel: "Jul 18",
      resumeName: "swe_2024.pdf",
      roleTitle: "Backend Intern",
      statusLabel: "Complete",
      readinessBand: "solid",
      readinessScore: 72,
      href: "/interview/s1/report",
    },
  ],
  totalSessions: 1,
};

describe("LandingEntry", () => {
  it("routes the launch control into setup", () => {
    render(<LandingEntry data={ready} />);
    expect(
      screen.getByRole("link", { name: /start project deep-dive/i }),
    ).toHaveAttribute("href", "/setup");
  });

  it("surfaces the loaded resume and role in the readiness checklist", () => {
    render(<LandingEntry data={ready} />);
    expect(screen.getAllByText("swe_2024.pdf").length).toBeGreaterThan(0);
    expect(screen.getByText("Backend Intern")).toBeInTheDocument();
    expect(screen.getByText(/4 claims · 2 need evidence/)).toBeInTheDocument();
  });

  it("shows real recent sessions with a readiness readout", () => {
    render(<LandingEntry data={ready} />);
    const link = screen.getByRole("link", { name: /swe_2024.pdf/i });
    expect(link).toHaveAttribute("href", "/interview/s1/report");
    expect(screen.getByText(/72 · solid/)).toBeInTheDocument();
  });

  it("first-run: prompts to add sources and teaches with an example challenge", () => {
    render(<LandingEntry />);
    expect(screen.getByText("No resume loaded")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue setup/i }),
    ).toHaveAttribute("href", "/setup");
    expect(screen.getByText(/example challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/no sessions yet/i)).toBeInTheDocument();
  });

  it("keeps the private-by-default reassurance", () => {
    render(<LandingEntry />);
    expect(screen.getByText(/private by default/i)).toBeInTheDocument();
  });
});
