import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RoleList } from "./role-list";
import type { TargetRoleSummary } from "./types";

const roles: TargetRoleSummary[] = [
  {
    id: "r1",
    title: "Backend Intern",
    company: "Acme",
    status: "Applied",
    rawText: "…",
    isActive: true,
    createdAt: new Date(),
    lastUsedAt: null,
    requirements: null,
  },
  {
    id: "r2",
    title: "Platform Intern",
    company: "Globex",
    status: null,
    rawText: "…",
    isActive: false,
    createdAt: new Date(),
    lastUsedAt: null,
    requirements: null,
  },
];

describe("RoleList", () => {
  it("renders roles with their company/status metadata", () => {
    render(
      <RoleList roles={roles} onSelect={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText("Backend Intern")).toBeInTheDocument();
    expect(screen.getByText("Acme · Applied")).toBeInTheDocument();
  });

  it("selects and edits via callbacks", async () => {
    const onSelect = vi.fn();
    const onEdit = vi.fn();
    render(
      <RoleList roles={roles} onSelect={onSelect} onEdit={onEdit} onDelete={vi.fn()} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Select" }));
    expect(onSelect).toHaveBeenCalledWith("r2");

    await userEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    expect(onEdit).toHaveBeenCalledWith("r1");
  });

  it("requires confirmation before deleting", async () => {
    const onDelete = vi.fn();
    render(
      <RoleList roles={roles} onSelect={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />,
    );

    await userEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onDelete).toHaveBeenCalledWith("r1");
  });
});
