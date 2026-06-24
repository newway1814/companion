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
        <p className="mb-1 font-semibold text-on-surface">Privacy guaranteed</p>
        <p className="text-body-md text-on-surface-variant">
          Your resumes and transcripts stay private. We do not use your data to
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
      <div role="status" className="text-center">
        <Mail className="mx-auto mb-4 size-8 text-primary" aria-hidden="true" />
        <h2 className="mb-2 font-heading text-headline-sm text-on-surface">
          Check your email
        </h2>
        <p className="text-body-md text-on-surface-variant">
          We sent a sign-in link to{" "}
          <span className="font-medium text-on-surface">{email}</span>. Click it
          to continue.
        </p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div>
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
