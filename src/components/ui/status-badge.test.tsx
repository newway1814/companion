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

  it("renders every status with its own text label", () => {
    render(
      <>
        <StatusBadge status="verified" />
        <StatusBadge status="missing" />
        <StatusBadge status="incomplete" />
        <StatusBadge status="warning" />
      </>,
    );

    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByText("Missing")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });
});
