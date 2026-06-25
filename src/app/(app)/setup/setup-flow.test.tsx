import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SetupFlow, type SetupResumeView, type SetupRoleView } from "./setup-flow";

const analyzedResume: SetupResumeView = {
  id: "r1",
  filename: "swe.pdf",
  claims: [{ title: "Pub/sub latency work", weakSpots: ["missing-baseline"] }],
};
const analyzedRole: SetupRoleView = {
  id: "role1",
  title: "Backend Intern",
  requirements: [{ text: "Distributed systems", importance: "required" }],
};

describe("SetupFlow", () => {
  it("blocks Continue until the extraction is reviewed, then enables it", async () => {
    render(<SetupFlow resume={analyzedResume} role={analyzedRole} />);

    // The extracted values are shown for review (and reflect current data).
    expect(screen.getByText(/Pub\/sub latency work/)).toBeInTheDocument();
    expect(screen.getByText(/Distributed systems/)).toBeInTheDocument();

    // Continue is a disabled button with the blocking reason in text.
    expect(
      screen.getByRole("button", { name: /continue to interview setup/i }),
    ).toBeDisabled();
    expect(screen.getByText(/confirm the extracted/i)).toBeInTheDocument();

    // Confirming the review unblocks it (now a real link into interview setup).
    await userEvent.click(screen.getByRole("checkbox"));
    const cta = screen.getByRole("link", {
      name: /continue to interview setup/i,
    });
    expect(cta).toHaveAttribute("href", "/interview-setup");
  });

  it("blocks and points to analysis when a resume is not analyzed", () => {
    render(
      <SetupFlow
        resume={{ id: "r1", filename: "swe.pdf", claims: null }}
        role={analyzedRole}
      />,
    );

    expect(screen.getByText(/analyze your resume's claims first/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue to interview setup/i }),
    ).toBeDisabled();
    // No review section until both sides are analyzed.
    expect(screen.queryByText(/review what companion extracted/i)).toBeNull();
  });
});
