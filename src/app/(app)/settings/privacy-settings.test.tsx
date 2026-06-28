import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { PrivacySettings } from "./privacy-settings";

const noop = vi.fn(async () => {});

describe("PrivacySettings", () => {
  it("states the private-by-default guarantee and data handling", () => {
    render(<PrivacySettings clearAction={noop} deleteAction={noop} />);

    expect(screen.getByText(/private by default/i)).toBeInTheDocument();
    expect(screen.getByText(/never shared/i)).toBeInTheDocument();
    expect(screen.getByText(/encrypted at rest/i)).toBeInTheDocument();
  });

  it("offers a session-history export download", () => {
    render(<PrivacySettings clearAction={noop} deleteAction={noop} />);

    const link = screen.getByRole("link", { name: /export/i });
    expect(link).toHaveAttribute("href", "/api/export");
    expect(link).toHaveAttribute("download");
  });

  it("clears workspace data only after confirmation", async () => {
    const clear = vi.fn(async () => {});
    render(<PrivacySettings clearAction={clear} deleteAction={noop} />);

    await userEvent.click(screen.getByRole("button", { name: /clear data/i }));
    expect(clear).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /confirm clear/i }));
    expect(clear).toHaveBeenCalledOnce();
  });

  it("deletes the account only after confirmation", async () => {
    const del = vi.fn(async () => {});
    render(<PrivacySettings clearAction={noop} deleteAction={del} />);

    await userEvent.click(screen.getByRole("button", { name: /^delete account$/i }));
    expect(del).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /confirm.*delete/i }));
    expect(del).toHaveBeenCalledOnce();
  });

  it("does not surface a billing tab (payments are out of scope)", () => {
    render(<PrivacySettings clearAction={noop} deleteAction={noop} />);

    expect(screen.queryByText(/billing/i)).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PrivacySettings clearAction={noop} deleteAction={noop} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
