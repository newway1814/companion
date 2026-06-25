import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResumeList } from "./resume-list";
import type { ResumeSummary } from "./types";

const resumes: ResumeSummary[] = [
  {
    id: "r1",
    filename: "Software_Engineer_2024.pdf",
    rawText: "…",
    isActive: true,
    createdAt: new Date("2023-10-24T00:00:00Z"),
    lastUsedAt: null,
  },
  {
    id: "r2",
    filename: "PM_Resume_Draft_v2.pdf",
    rawText: "…",
    isActive: false,
    createdAt: new Date("2023-09-12T00:00:00Z"),
    lastUsedAt: null,
  },
];

describe("ResumeList", () => {
  it("renders each saved resume with its upload date", () => {
    render(<ResumeList resumes={resumes} onSelect={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Software_Engineer_2024.pdf")).toBeInTheDocument();
    expect(screen.getByText("PM_Resume_Draft_v2.pdf")).toBeInTheDocument();
    expect(screen.getByText(/Oct 24, 2023/)).toBeInTheDocument();
  });

  it("selects an inactive resume", async () => {
    const onSelect = vi.fn();
    render(
      <ResumeList resumes={resumes} onSelect={onSelect} onDelete={vi.fn()} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Select" }));

    expect(onSelect).toHaveBeenCalledWith("r2");
  });

  it("requires confirmation before deleting", async () => {
    const onDelete = vi.fn();
    render(
      <ResumeList resumes={resumes} onSelect={vi.fn()} onDelete={onDelete} />,
    );

    // Clicking delete does not delete immediately…
    await userEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    expect(onDelete).not.toHaveBeenCalled();

    // …it asks to confirm first.
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onDelete).toHaveBeenCalledWith("r1");
  });
});
