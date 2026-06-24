import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("conveys status with a text label, not color alone", () => {
    render(<StatusBadge status="missing" />);

    // The status word must be present as text so it is not signalled by colour only.
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("supports overriding the label text", () => {
    render(<StatusBadge status="verified" label="Baseline verified" />);

    expect(screen.getByText("Baseline verified")).toBeInTheDocument();
  });
});
