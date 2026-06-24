import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TranscriptRow } from "./transcript-row";

describe("TranscriptRow", () => {
  it("renders the speaker and turn text", () => {
    render(<TranscriptRow speaker="Interviewer">Walk me through it.</TranscriptRow>);

    expect(screen.getByText("Interviewer")).toBeInTheDocument();
    expect(screen.getByText("Walk me through it.")).toBeInTheDocument();
  });

  it("marks the active turn for assistive technology", () => {
    render(
      <TranscriptRow speaker="Interviewer" state="active">
        Walk me through it.
      </TranscriptRow>,
    );

    const row = screen.getByText("Walk me through it.").closest("[aria-current]");
    expect(row).toHaveAttribute("aria-current", "step");
  });
});
