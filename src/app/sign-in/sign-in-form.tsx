"use client";

import { Lock, Mail } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

function PrivacyReassurance() {
  return (
    <div className="mt-8 flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container p-4">
      <Lock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="mb-1 font-semibold text-on-surface">Private by default</p>
        <p className="text-body-md text-on-surface-variant">
          Your resumes and transcripts stay yours, and we do not use your data to
          train public models.
        </p>
      </div>
    </div>
  );
}

export function SignInForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (otpError) {
      setError(otpError.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div role="status">
        <span className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-primary-container/15 text-primary">
          <Mail className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mb-3 font-heading text-display-md text-balance text-on-surface">
          Check your email
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          We sent a sign-in link to{" "}
          <span className="font-medium text-on-surface">{email}</span>. Click it
          to continue — it expires in a few minutes.
        </p>
        <Button
          variant="ghost"
          className="mt-6 -ml-4"
          onClick={() => setStatus("idle")}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-md text-balance text-on-surface">
          Your interviewer is ready.
        </h1>
        <p className="mt-3 text-body-lg text-on-surface-variant">
          Enter your email and we&apos;ll send a one-time sign-in link — no
          password to remember.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-body-md font-medium text-on-surface"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "sign-in-error" : undefined}
          />
        </div>

        {status === "error" && error ? (
          <p
            id="sign-in-error"
            role="alert"
            className="text-body-md text-on-error-container"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={status === "sending"} className="w-full">
          {status === "sending" ? "Sending…" : "Continue with email"}
        </Button>
      </form>

      <PrivacyReassurance />
    </div>
  );
}
