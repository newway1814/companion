import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import type { CoachingReport } from "@/lib/interview/report";

import { ReportView } from "./report-view";
import type { GenerateReportState } from "./types";

const report: CoachingReport = {
  readiness: {
    band: "solid",
    score: 68,
    summary: "Solid ownership; tighten how you evidence results.",
  },
  answerScores: [],
  technicalDepth: [
    { area: "Measured results", status: "incomplete", note: "Latency claim lacks a baseline." },
  ],
  claimDefenseVulnerabilities: [
    { claim: "Reduced API latency by 40%", issue: "No baseline given." },
  ],
  suggestedReframing: [
    { original: "I improved performance.", improved: "Before, p99 was [baseline]; after, [result]." },
  ],
  nextPractice: { focus: "Metrics", drill: "Re-answer with a baseline and measured delta." },
};

const meta = {
  roleTitle: "Backend Intern",
  completedAtISO: "2026-06-27T12:00:00.000Z",
};

const noop = vi.fn(async () => {});
const genNoop = vi.fn(async (): Promise<GenerateReportState> => null);

function renderReport(
  overrides: Partial<Parameters<typeof ReportView>[0]> = {},
) {
  return render(
    <ReportView
      report={report}
      sessionId="sess-1"
      meta={meta}
      generateAction={genNoop}
      drillAction={noop}
      improvedReadAction={noop}
      {...overrides}
    />,
  );
}

describe("ReportView", () => {
  it("offers to generate the report when none exists yet", async () => {
    const action = vi.fn(async (): Promise<GenerateReportState> => null);
    renderReport({ report: null, generateAction: action });

    await userEvent.click(
      screen.getByRole("button", { name: /generate coaching report/i }),
    );

    expect(action).toHaveBeenCalledOnce();
  });

  it("shows an accessible error with a retry path when generation fails", async () => {
    const action = vi.fn(
      async (): Promise<GenerateReportState> => ({
        error: "Could not build your report. Please try again.",
      }),
    );
    renderReport({ report: null, generateAction: action });

    await userEvent.click(
      screen.getByRole("button", { name: /generate coaching report/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not build/i);
    expect(
      screen.getByRole("button", { name: /generate coaching report/i }),
    ).toBeEnabled();
  });

  it("renders readiness and the key coaching sections once generated", () => {
    renderReport();

    expect(screen.getByText(/68/)).toBeInTheDocument();
    expect(screen.getByText(/^solid$/i)).toBeInTheDocument();
    expect(screen.getByText(/reduced api latency by 40%/i)).toBeInTheDocument();
    expect(
      screen.getByText(/re-answer with a baseline and measured delta\./i),
    ).toBeInTheDocument();
  });

  it("shows session metadata and the readiness band/score in the header", () => {
    renderReport();

    expect(
      screen.getByRole("heading", { name: /final coaching report/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/backend intern/i)).toBeInTheDocument();
    expect(screen.getByText(/readiness score/i)).toBeInTheDocument();
  });

  it("renders the depth, vulnerability, and reframing sections with non-color status text", () => {
    renderReport();

    expect(
      screen.getByRole("heading", { name: /technical depth/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /claim-defense vulnerabilities/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /suggested reframing/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^incomplete$/i)).toBeInTheDocument();
  });

  it("records reading an improved answer when it is copied", async () => {
    const read = vi.fn(async () => {});
    renderReport({ improvedReadAction: read });

    await userEvent.click(
      screen.getByRole("button", { name: /copy improved answer/i }),
    );

    expect(read).toHaveBeenCalledOnce();
  });

  it("offers navigation back to history, resumes, roles, and a new session", () => {
    renderReport();

    expect(screen.getByRole("link", { name: /session history/i })).toHaveAttribute(
      "href",
      "/sessions",
    );
    expect(screen.getByRole("link", { name: /resumes/i })).toHaveAttribute(
      "href",
      "/resumes",
    );
    expect(screen.getByRole("link", { name: /target roles/i })).toHaveAttribute(
      "href",
      "/roles",
    );
    expect(screen.getByRole("link", { name: /new session/i })).toHaveAttribute(
      "href",
      "/setup",
    );
  });

  it("has no axe violations", async () => {
    const { container } = renderReport();

    expect(await axe(container)).toHaveNoViolations();
  });
});
