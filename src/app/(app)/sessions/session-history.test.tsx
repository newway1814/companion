import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import type { SessionRow } from "./history";
import { SessionHistory } from "./session-history";

const rows: SessionRow[] = [
  {
    id: "s1",
    createdAtISO: "2026-06-20T10:00:00.000Z",
    resumeName: "swe-resume.pdf",
    roleTitle: "Backend Intern",
    readinessScore: 68,
    readinessBand: "solid",
    statusLabel: "Complete",
    hasReport: true,
  },
  {
    id: "s2",
    createdAtISO: "2026-06-21T10:00:00.000Z",
    resumeName: "frontend.pdf",
    roleTitle: "UI Engineer",
    readinessScore: null,
    readinessBand: null,
    statusLabel: "In progress",
    hasReport: false,
  },
];

const noop = vi.fn(async () => {});

describe("SessionHistory", () => {
  it("lists sessions in a table with date, resume, role, readiness, and status", () => {
    render(<SessionHistory rows={rows} deleteAction={noop} />);

    const table = screen.getByRole("table");
    expect(within(table).getByText("swe-resume.pdf")).toBeInTheDocument();
    expect(within(table).getByText("Backend Intern")).toBeInTheDocument();
    expect(within(table).getByText(/68%/)).toBeInTheDocument();
    expect(within(table).getByText("Complete")).toBeInTheDocument();
  });

  it("narrows the list with the search box", async () => {
    render(<SessionHistory rows={rows} deleteAction={noop} />);

    await userEvent.type(screen.getByRole("searchbox"), "ui engineer");

    expect(screen.queryByText("Backend Intern")).toBeNull();
    expect(screen.getByText("UI Engineer")).toBeInTheDocument();
  });

  it("links a completed session to its coaching report", () => {
    render(<SessionHistory rows={rows} deleteAction={noop} />);

    expect(
      screen.getByRole("link", { name: /open report/i }),
    ).toHaveAttribute("href", "/interview/s1/report");
  });

  it("deletes a session only after confirmation", async () => {
    const del = vi.fn(async (formData: FormData) => {
      expect(formData.get("sessionId")).toBe("s1");
    });
    render(<SessionHistory rows={rows} deleteAction={del} />);

    // First click reveals a confirm step rather than deleting immediately.
    await userEvent.click(screen.getAllByRole("button", { name: /^delete$/i })[0]);
    expect(del).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /confirm delete/i }));
    expect(del).toHaveBeenCalledOnce();
  });

  it("shows an empty state pointing to a new deep-dive when there are no sessions", () => {
    render(<SessionHistory rows={[]} deleteAction={noop} />);

    expect(screen.getByText(/no practice sessions yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /start a project deep-dive/i }),
    ).toHaveAttribute("href", "/setup");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SessionHistory rows={rows} deleteAction={noop} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
