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

describe("ReportView", () => {
  it("offers to generate the report when none exists yet", async () => {
    const action = vi.fn(async (): Promise<GenerateReportState> => null);
    render(<ReportView report={null} sessionId="sess-1" generateAction={action} />);

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
    render(<ReportView report={null} sessionId="sess-1" generateAction={action} />);

    await userEvent.click(
      screen.getByRole("button", { name: /generate coaching report/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not build/i);
    expect(
      screen.getByRole("button", { name: /generate coaching report/i }),
    ).toBeEnabled();
  });

  it("renders readiness and the key coaching sections once generated", () => {
    const action = vi.fn(async (): Promise<GenerateReportState> => null);
    render(<ReportView report={report} sessionId="sess-1" generateAction={action} />);

    expect(screen.getByText(/68/)).toBeInTheDocument();
    expect(screen.getByText(/^solid$/i)).toBeInTheDocument();
    expect(screen.getByText(/reduced api latency by 40%/i)).toBeInTheDocument();
    expect(
      screen.getByText(/re-answer with a baseline and measured delta\./i),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const action = vi.fn(async (): Promise<GenerateReportState> => null);
    const { container } = render(<ReportView report={report} sessionId="sess-1" generateAction={action} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
