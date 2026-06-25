import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RoleRequirements } from "@/lib/target-role/extraction";

import { RoleAnalysis } from "./role-analysis";
import type { AnalyzeRoleState } from "./types";

const requirements: RoleRequirements = {
  requirements: [
    { text: "Distributed systems", importance: "required" },
    { text: "Go", importance: "preferred" },
  ],
  impliedNeeds: ["On-call readiness"],
  companionNotes: [
    {
      note: "Role wants measured latency work; your pub/sub claim lacks a baseline.",
      relatedResumeClaim: "Pub/sub latency work",
    },
  ],
  starPrompts: ["Draft a STAR story about owning a latency improvement."],
};

describe("RoleAnalysis", () => {
  it("renders requirements, implied needs, companion notes, and prep prompts", () => {
    render(
      <RoleAnalysis roleId="r1" requirements={requirements} action={vi.fn()} />,
    );

    expect(screen.getByText("Distributed systems")).toBeInTheDocument();
    expect(screen.getByText("On-call readiness")).toBeInTheDocument();
    expect(screen.getByText(/your pub\/sub claim lacks a baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/Related: Pub\/sub latency work/i)).toBeInTheDocument();
    expect(screen.getByText(/draft a star story/i)).toBeInTheDocument();
    // importance shown as text, not colour alone
    expect(screen.getAllByText(/required|preferred/i).length).toBeGreaterThan(0);
  });

  it("offers an analyze action when there is no analysis yet", async () => {
    const action = vi.fn(
      async (_s: AnalyzeRoleState, formData: FormData): Promise<AnalyzeRoleState> => {
        expect(formData.get("id")).toBe("r1");
        return { error: undefined };
      },
    );
    render(<RoleAnalysis roleId="r1" requirements={null} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: /analyze role/i }));
    expect(action).toHaveBeenCalledOnce();
  });

  it("shows an accessible error and retry path on failure", async () => {
    const action = vi.fn(
      async (): Promise<AnalyzeRoleState> => ({ error: "Could not analyze this role." }),
    );
    render(<RoleAnalysis roleId="r1" requirements={null} action={action} />);

    await userEvent.click(screen.getByRole("button", { name: /analyze role/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not analyze/i);
    expect(screen.getByRole("button", { name: /analyze role/i })).toBeInTheDocument();
  });
});
