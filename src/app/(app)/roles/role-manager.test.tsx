import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RoleManager } from "./role-manager";
import type { TargetRoleFormState, TargetRoleSummary } from "./types";

const roles: TargetRoleSummary[] = [
  {
    id: "r1",
    title: "Backend Intern",
    company: "Acme",
    status: "Applied",
    rawText: "Build APIs.",
    isActive: true,
    createdAt: new Date(),
    lastUsedAt: null,
  },
];

const noopSave = vi.fn(async (): Promise<TargetRoleFormState> => ({ ok: true }));

describe("RoleManager", () => {
  it("switches the form into edit mode pre-filled with the chosen role", async () => {
    render(
      <RoleManager
        roles={roles}
        saveAction={noopSave}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    // Starts in create mode.
    expect(
      screen.getByRole("heading", { name: /add a target role/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(
      screen.getByRole("heading", { name: /edit role/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/role title/i)).toHaveValue("Backend Intern");
  });
});
