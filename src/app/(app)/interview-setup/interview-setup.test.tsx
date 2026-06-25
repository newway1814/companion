import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { InterviewSetup } from "./interview-setup";
import type { StartInterviewState } from "./types";

const view = {
  resume: { filename: "swe-resume.pdf", projectCount: 3 },
  role: { title: "Backend Intern", requirementCount: 5 },
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

describe("InterviewSetup", () => {
  beforeEach(() => push.mockClear());

  it("shows the locked source profile, target position, and five-question framing", () => {
    const action = vi.fn(async (): Promise<StartInterviewState> => null);
    render(<InterviewSetup view={view} startAction={action} />);

    expect(screen.getByText("swe-resume.pdf")).toBeInTheDocument();
    expect(screen.getByText(/3 projects detected/i)).toBeInTheDocument();
    expect(screen.getByText("Backend Intern")).toBeInTheDocument();
    expect(screen.getByText(/5 role requirements found/i)).toBeInTheDocument();
    expect(screen.getByText(/5 questions/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start interview/i }),
    ).toBeEnabled();
  });

  it("opens the interview room for the created session on success", async () => {
    const action = vi.fn(
      async (): Promise<StartInterviewState> => ({ sessionId: "sess-42" }),
    );
    render(<InterviewSetup view={view} startAction={action} />);

    await userEvent.click(screen.getByRole("button", { name: /start interview/i }));

    expect(action).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/interview/sess-42"),
    );
  });

  it("shows an accessible error and lets the user retry when planning fails", async () => {
    const action = vi.fn(
      async (): Promise<StartInterviewState> => ({
        error: "Could not build your session. Please try again.",
      }),
    );
    render(<InterviewSetup view={view} startAction={action} />);

    await userEvent.click(screen.getByRole("button", { name: /start interview/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not build/i);
    expect(
      screen.getByRole("button", { name: /start interview/i }),
    ).toBeEnabled();
  });

  it("surfaces an in-progress status while the plan is generated", async () => {
    const d = deferred<StartInterviewState>();
    const action = vi.fn(() => d.promise);
    render(<InterviewSetup view={view} startAction={action} />);

    await userEvent.click(screen.getByRole("button", { name: /start interview/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/preparing/i);
    d.resolve(null);
  });

  it("has no axe violations", async () => {
    const action = vi.fn(async (): Promise<StartInterviewState> => null);
    const { container } = render(
      <InterviewSetup view={view} startAction={action} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
