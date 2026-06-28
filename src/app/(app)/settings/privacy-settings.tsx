"use client";

import { Download, ShieldCheck, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

export type SettingsAction = (formData: FormData) => void | Promise<void>;

const DATA_HANDLING = [
  "Resumes and interview transcripts are encrypted at rest.",
  "Feedback uses isolated model calls; your inputs do not train public models.",
  "You keep full ownership of everything you upload.",
];

function DestructiveControl({
  title,
  description,
  buttonLabel,
  confirmLabel,
  confirmPrompt,
  action,
  tone = "default",
}: {
  title: string;
  description: string;
  buttonLabel: string;
  confirmLabel: string;
  confirmPrompt: string;
  action: SettingsAction;
  tone?: "default" | "danger";
}) {
  const [confirming, setConfirming] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="max-w-prose">
        <p
          className={
            tone === "danger"
              ? "font-medium text-on-error-container"
              : "font-medium text-on-surface"
          }
        >
          {title}
        </p>
        <p className="text-body-md text-on-surface-variant">{description}</p>
      </div>
      {confirming ? (
        <form action={action} className="flex items-center gap-2">
          <span
            role="alert"
            className="flex items-center gap-1 text-body-md text-on-error-container"
          >
            <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
            {confirmPrompt}
          </span>
          <Button type="submit" variant="secondary" className="border-error text-on-error-container">
            {confirmLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setConfirming(true)}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}

export function PrivacySettings({
  clearAction,
  deleteAction,
}: {
  clearAction: SettingsAction;
  deleteAction: SettingsAction;
}) {
  return (
    <div className="mx-auto max-w-3xl p-gutter py-10">
      <h1 className="font-heading text-display-md text-on-surface">
        Privacy &amp; settings
      </h1>
      <p className="mt-1 text-body-lg text-on-surface-variant">
        Manage your data controls and how Companion handles your information.
      </p>

      <section
        aria-labelledby="privacy-guarantee"
        className="mt-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-6"
      >
        <h2
          id="privacy-guarantee"
          className="flex items-center gap-2 font-heading text-section-title text-on-surface"
        >
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          Privacy guarantee
        </h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Companion is private by default. Your data is never shared or used for
          public model training.
        </p>
        <div className="mt-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
          <p className="mb-2 text-label-caps uppercase tracking-wide text-on-surface-variant">
            How we handle your data
          </p>
          <ul className="space-y-1 text-body-md text-on-surface">
            {DATA_HANDLING.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 text-primary">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="data-controls"
        className="mt-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6"
      >
        <h2
          id="data-controls"
          className="font-heading text-section-title text-on-surface"
        >
          Data controls
        </h2>

        <div className="mt-2 divide-y divide-outline-variant">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="max-w-prose">
              <p className="font-medium text-on-surface">Export session history</p>
              <p className="text-body-md text-on-surface-variant">
                Download a JSON of your past interview sessions, transcripts, and
                feedback.
              </p>
            </div>
            <a
              href="/api/export"
              download="companion-export.json"
              className="inline-flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Download className="size-4" aria-hidden="true" />
              Export
            </a>
          </div>

          <DestructiveControl
            title="Clear workspace data"
            description="Remove all uploaded resumes, target roles, and session history."
            buttonLabel="Clear data"
            confirmLabel="Confirm clear"
            confirmPrompt="This permanently removes all your workspace data."
            action={clearAction}
          />

          <DestructiveControl
            title="Delete account"
            description="Permanently remove your account and all associated data. This cannot be undone."
            buttonLabel="Delete account"
            confirmLabel="Confirm delete account"
            confirmPrompt="This permanently deletes your account and all data."
            action={deleteAction}
            tone="danger"
          />
        </div>
      </section>
    </div>
  );
}
