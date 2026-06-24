import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { SignInForm } from "./sign-in-form";

function mockAuth(overrides: { otpError?: { message: string } } = {}) {
  const signInWithOtp = vi
    .fn()
    .mockResolvedValue({ error: overrides.otpError ?? null });
  (createSupabaseBrowserClient as Mock).mockReturnValue({
    auth: { signInWithOtp },
  });
  return { signInWithOtp };
}

describe("SignInForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders an email field, submit button, and privacy reassurance", () => {
    mockAuth();
    render(<SignInForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with email/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/do not use your data to train/i)).toBeInTheDocument();
  });

  it("sends a magic link to the entered email and confirms", async () => {
    const { signInWithOtp } = mockAuth();
    render(<SignInForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "ada@uni.edu");
    await userEvent.click(
      screen.getByRole("button", { name: /continue with email/i }),
    );

    expect(signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ada@uni.edu" }),
    );
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
  });

  it("shows an accessible error when sending the link fails", async () => {
    mockAuth({ otpError: { message: "Email rate limit exceeded" } });
    render(<SignInForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "ada@uni.edu");
    await userEvent.click(
      screen.getByRole("button", { name: /continue with email/i }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/rate limit/i);
  });
});
