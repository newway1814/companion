import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EvidenceChip } from "./evidence-chip";

describe("EvidenceChip", () => {
  it("renders its evidence label", () => {
    render(<EvidenceChip>Baseline</EvidenceChip>);

    expect(screen.getByText("Baseline")).toBeInTheDocument();
  });
});
