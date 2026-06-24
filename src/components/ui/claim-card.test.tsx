import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClaimCard } from "./claim-card";

describe("ClaimCard", () => {
  it("renders its claim title and supporting content", () => {
    render(
      <ClaimCard title="Reduced API latency" variant="verified">
        <p>Cut p95 latency from 800ms to 120ms.</p>
      </ClaimCard>,
    );

    expect(
      screen.getByRole("heading", { name: "Reduced API latency" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cut p95 latency from 800ms to 120ms."),
    ).toBeInTheDocument();
  });
});
