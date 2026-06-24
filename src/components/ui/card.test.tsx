import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./card";

describe("Card", () => {
  it("renders an optional title as a heading alongside its content", () => {
    render(
      <Card title="Saved resumes">
        <p>No resumes yet</p>
      </Card>,
    );

    expect(
      screen.getByRole("heading", { name: "Saved resumes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No resumes yet")).toBeInTheDocument();
  });
});
