"use client";

import * as React from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { validateResumeUpload } from "@/lib/resume/validation";

import type { AddResumeAction } from "./types";

export function ResumeUploadForm({ action }: { action: AddResumeAction }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setFileError(null);
      return;
    }
    const result = validateResumeUpload({ type: file.type, size: file.size });
    setFileError(result.ok ? null : result.error);
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="resume-file"
          className="block text-body-md font-medium text-on-surface"
        >
          Upload a PDF
        </label>
        <input
          id="resume-file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="block w-full text-body-md text-on-surface-variant file:mr-3 file:rounded file:border file:border-outline-variant file:bg-surface-container-lowest file:px-3 file:py-1.5 file:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {fileError ? (
        <p role="alert" className="text-body-md text-on-error-container">
          {fileError}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label
          htmlFor="resume-text"
          className="block text-body-md font-medium text-on-surface"
        >
          Or paste your resume text
        </label>
        <textarea
          id="resume-text"
          name="text"
          rows={4}
          placeholder="Paste your resume here…"
          className="w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="text-body-md text-on-error-container">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending || fileError !== null}
        className="w-full"
      >
        {pending ? "Adding…" : "Add resume"}
      </Button>
    </form>
  );
}
