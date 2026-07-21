import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/lib/auth", () => ({ getUser: vi.fn() }));
vi.mock("@/components/marketing/evidence-scene-boundary", () => ({
  EvidenceSceneBoundary: () => null,
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth";

import HomePage from "./page";

describe("public root route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the marketing experience for a logged-out visitor", async () => {
    (getUser as Mock).mockResolvedValue(null);

    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Defend the work behind your resume.",
      }),
    ).toBeInTheDocument();
  });

  it("sends an authenticated visitor to the protected dashboard", async () => {
    (getUser as Mock).mockResolvedValue({ id: "user-1" });

    await expect(HomePage()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});
