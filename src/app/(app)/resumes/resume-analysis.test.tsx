import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ResumeProfile } from "@/lib/resume/extraction";

import { ResumeAnalysis } from "./resume-analysis";
import type { AnalyzeResumeState } from "./types";

const profile: ResumeProfile = {
  summary: "Engineer.",
  skills: ["TypeScript"],
  claims: [
    {
      title: "Pub/sub latency work",
      technologies: ["Node.js"],
      metrics: ["Reduced API latency by 40%"],
      status: "hypothesis",
      weakSpots: ["missing-baseline"],
      warning: "States a 40% gain but no baseline.",
      suggestedRevision: "Add the baseline: [baseline] ms → [result] ms.",
    },
  ],
};

const noop = vi.fn(async (): Promise<AnalyzeResumeState> => ({ error: undefined }));

describe("ResumeAnalysis", () => {
  it("renders claims with metric badges, weak-spot text, and the suggested revision", () => {
    render(<ResumeAnalysis resumeId="r1" profile={profile} action={noop} />);

    expect(screen.getByText("Pub/sub latency work")).toBeInTheDocument();
    expect(screen.getByText("Reduced API latency by 40%")).toBeInTheDocument();
    // weak spot is conveyed as text, not colour alone
    expect(screen.getByText(/missing baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/add the baseline/i)).toBeInTheDocument();
  });

  it("offers an analyze action when there is no profile yet", async () => {
    const action = vi.fn(
      async (_s: AnalyzeResumeState, formData: FormData): Promise<AnalyzeResumeState> => {
        expect(formData.get("id")).toBe("r1");
        return { error: undefined };
      },
    );
    render(<ResumeAnalysis resumeId="r1" profile={null} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: /analyze claims/i }));

    expect(action).toHaveBeenCalledOnce();
  });

  it("shows an accessible error and retry path when analysis fails", async () => {
    const action = vi.fn(
      async (): Promise<AnalyzeResumeState> => ({ error: "Could not analyze this resume." }),
    );
    render(<ResumeAnalysis resumeId="r1" profile={null} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: /analyze claims/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not analyze/i);
    // the analyze button is still present to retry
    expect(screen.getByRole("button", { name: /analyze claims/i })).toBeInTheDocument();
  });
});
