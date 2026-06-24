import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders an accessible button and handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Start practice</Button>);

    const button = screen.getByRole("button", { name: "Start practice" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });
});
