import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { EvidencePanel } from "./evidence-panel";
import type { EvidenceView } from "./room-view";

const evidence: EvidenceView = {
  targetClaim: "Reduced API latency by 40%",
  probingFocus: "Probe for a baseline and a measured result.",
  requiredEvidence: [
    { label: "Baseline measurement", satisfied: true },
    { label: "Measurement method", satisfied: false },
  ],
  notes: "Waiting for your response — listening for contribution, method, and tradeoffs.",
};

describe("EvidencePanel", () => {
  it("shows the target claim, required evidence, and interviewer notes", () => {
    render(<EvidencePanel evidence={evidence} />);

    expect(screen.getByText(/reduced api latency by 40%/i)).toBeInTheDocument();
    expect(screen.getByText("Baseline measurement")).toBeInTheDocument();
    expect(screen.getByText("Measurement method")).toBeInTheDocument();
    expect(
      screen.getByText(/waiting for your response/i),
    ).toBeInTheDocument();
  });

  it("marks satisfied vs outstanding evidence with text, not colour alone", () => {
    render(<EvidencePanel evidence={evidence} />);

    expect(screen.getByText(/^satisfied$/i)).toBeInTheDocument();
    expect(screen.getByText(/^outstanding$/i)).toBeInTheDocument();
  });

  it("renders the required evidence as a navigable list", () => {
    render(<EvidencePanel evidence={evidence} />);

    const list = screen.getByRole("list", { name: /required evidence/i });
    expect(list).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<EvidencePanel evidence={evidence} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
