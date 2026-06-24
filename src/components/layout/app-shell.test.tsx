import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/resumes" }));

import { AppShell, isActive } from "./app-shell";

describe("AppShell", () => {
  it("renders primary navigation and marks the active route", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Resumes" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("renders page content inside a main landmark", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    expect(screen.getByRole("main")).toHaveTextContent("Page content");
  });

  it("exposes a mobile navigation toggle that reflects its open state", async () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    const toggle = screen.getByRole("button", { name: /navigation/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus into the drawer when it opens", async () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    await userEvent.click(screen.getByRole("button", { name: /navigation/i }));

    expect(screen.getByRole("link", { name: "New session" })).toHaveFocus();
  });

  it("closes the drawer when Escape is pressed", async () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    const toggle = screen.getByRole("button", { name: /navigation/i });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("matches the shell snapshot", () => {
    const { container } = render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );

    expect(container).toMatchSnapshot();
  });
});

describe("isActive", () => {
  it("matches the exact route and nested children but not prefix siblings", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/resumes", "/")).toBe(false);
    expect(isActive("/roles", "/roles")).toBe(true);
    expect(isActive("/roles/123", "/roles")).toBe(true);
    expect(isActive("/roles-archive", "/roles")).toBe(false);
  });
});
