import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("is reachable by its label and accepts typed input", async () => {
    render(
      <>
        <label htmlFor="role">Target role</label>
        <Input id="role" />
      </>,
    );

    const input = screen.getByLabelText("Target role");
    await userEvent.type(input, "SWE Intern");

    expect(input).toHaveValue("SWE Intern");
  });
});
