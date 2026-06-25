import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RoleForm } from "./role-form";
import type { TargetRoleFormState, TargetRoleSummary } from "./types";

const role: TargetRoleSummary = {
  id: "role-1",
  title: "Backend Intern",
  company: "Acme",
  status: "Applied",
  rawText: "Build and operate APIs.",
  isActive: true,
  createdAt: new Date(),
  lastUsedAt: null,
};

describe("RoleForm", () => {
  it("submits the entered title and description", async () => {
    const action = vi.fn(
      async (_s: TargetRoleFormState, formData: FormData): Promise<TargetRoleFormState> => {
        expect(formData.get("title")).toBe("Frontend Intern");
        expect(formData.get("rawText")).toBe("Ship UI features.");
        expect(formData.get("id")).toBeNull();
        return { ok: true };
      },
    );
    render(<RoleForm action={action} />);

    await userEvent.type(screen.getByLabelText(/role title/i), "Frontend Intern");
    await userEvent.type(
      screen.getByLabelText(/role description/i),
      "Ship UI features.",
    );
    await userEvent.click(screen.getByRole("button", { name: /add role/i }));

    expect(action).toHaveBeenCalledOnce();
  });

  it("pre-fills fields and posts the id when editing", async () => {
    const action = vi.fn(
      async (_s: TargetRoleFormState, formData: FormData): Promise<TargetRoleFormState> => {
        expect(formData.get("id")).toBe("role-1");
        return { ok: true };
      },
    );
    render(<RoleForm initial={role} action={action} />);

    expect(screen.getByLabelText(/role title/i)).toHaveValue("Backend Intern");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(action).toHaveBeenCalledOnce();
  });

  it("shows an accessible error returned by the action", async () => {
    const action = vi.fn(
      async (): Promise<TargetRoleFormState> => ({ error: "Add a role title." }),
    );
    render(<RoleForm action={action} />);

    await userEvent.type(screen.getByLabelText(/role description/i), "text");
    await userEvent.click(screen.getByRole("button", { name: /add role/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/add a role title/i);
  });
});
