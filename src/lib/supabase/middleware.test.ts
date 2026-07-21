import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@supabase/ssr", () => ({ createServerClient: vi.fn() }));

import { createServerClient } from "@supabase/ssr";

import { updateSession } from "./middleware";

type MaybeUser = { id: string } | null;

function withUser(user: MaybeUser) {
  (createServerClient as Mock).mockReturnValue({
    auth: { getUser: async () => ({ data: { user } }) },
  });
}

function locationOf(response: Response) {
  const location = response.headers.get("location");
  return location ? new URL(location).pathname : null;
}

describe("updateSession", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects an unauthenticated request for a protected route to sign-in", async () => {
    withUser(null);

    const response = await updateSession(
      new NextRequest("http://localhost:3000/resumes"),
    );

    expect(response.status).toBe(307);
    expect(locationOf(response)).toBe("/sign-in");
  });

  it("lets an unauthenticated request reach a public route", async () => {
    withUser(null);

    const response = await updateSession(
      new NextRequest("http://localhost:3000/"),
    );

    expect(locationOf(response)).not.toBe("/sign-in");
    expect(response.status).toBe(200);
  });

  it("redirects an unauthenticated dashboard request to sign-in", async () => {
    withUser(null);

    const response = await updateSession(
      new NextRequest("http://localhost:3000/dashboard"),
    );

    expect(response.status).toBe(307);
    expect(locationOf(response)).toBe("/sign-in");
  });

  it("lets an authenticated request reach the dashboard", async () => {
    withUser({ id: "user-1" });

    const response = await updateSession(
      new NextRequest("http://localhost:3000/dashboard"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("lets an authenticated request through to a protected route", async () => {
    withUser({ id: "user-1" });

    const response = await updateSession(
      new NextRequest("http://localhost:3000/resumes"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
