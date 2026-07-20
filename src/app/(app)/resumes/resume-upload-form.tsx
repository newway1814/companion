"use client";

import { FileText, UploadCloud, X } from "lucide-react";
import * as React from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validateResumeUpload } from "@/lib/resume/validation";

import type { AddResumeAction } from "./types";

export function ResumeUploadForm({ action }: { action: AddResumeAction }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function validate(file: File | undefined) {
    if (!file) {
      setFileError(null);
      setFileName(null);
      return;
    }
    const result = validateResumeUpload({ type: file.type, size: file.size });
    setFileError(result.ok ? null : result.error);
    setFileName(file.name);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    validate(event.target.files?.[0]);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file || !fileInputRef.current) return;
    // Route the dropped file through the native input so the form submits it.
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInputRef.current.files = transfer.files;
    validate(file);
  }

  function handleRemoveFile() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileError(null);
    setFileName(null);
  }

  return (
    <form action={formAction} aria-busy={pending} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="resume-file"
          className="block text-body-md font-medium text-on-surface"
        >
          Upload a PDF
        </label>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25",
            dragging
              ? "border-primary bg-primary-container/10"
              : fileError
                ? "border-error/60 bg-error-container/10"
                : "border-outline bg-surface hover:border-outline hover:bg-surface-container-low/50",
          )}
        >
          <input
            ref={fileInputRef}
            id="resume-file"
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-describedby={fileError ? "resume-file-error" : undefined}
          />
          <span
            className="flex size-11 items-center justify-center rounded-full bg-surface-container text-primary"
            aria-hidden="true"
          >
            <UploadCloud className="size-5" />
          </span>
          <p className="text-body-md text-on-surface">
            <span className="font-medium text-primary">Click to browse</span> or
            drag &amp; drop
          </p>
          <p className="text-mono-label text-on-surface-variant">PDF, up to 5&nbsp;MB</p>
        </div>

        {fileName && !fileError ? (
          <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2">
            <FileText className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-body-md text-on-surface">
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="rounded p-0.5 text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Remove ${fileName}`}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {fileError ? (
          <div className="flex items-center justify-between gap-3">
            <p id="resume-file-error" role="alert" className="text-body-md text-on-error-container">
              {fileError}
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
              Remove file
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-outline-variant" />
        <span className="text-label-caps uppercase tracking-wide text-on-surface-variant">
          or
        </span>
        <span className="h-px flex-1 bg-outline-variant" />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="resume-text"
          className="block text-body-md font-medium text-on-surface"
        >
          Or paste your resume text
        </label>
        <textarea
          id="resume-text"
          name="text"
          rows={5}
          placeholder="Paste your resume here…"
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="text-body-md text-on-error-container">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || fileError !== null} className="w-full">
        {pending ? "Adding…" : "Add resume"}
      </Button>

      <p role="status" className="sr-only">
        {pending ? "Adding your resume…" : ""}
      </p>
    </form>
  );
}
