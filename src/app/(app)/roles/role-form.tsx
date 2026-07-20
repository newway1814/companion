"use client";

import * as React from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { SaveTargetRoleAction, TargetRoleSummary } from "./types";

export function RoleForm({
  initial,
  action,
  onDone,
  onCancel,
}: {
  initial?: TargetRoleSummary | null;
  action: SaveTargetRoleAction;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const editing = Boolean(initial);

  React.useEffect(() => {
    if (state && "ok" in state) onDone?.();
  }, [state, onDone]);

  return (
    <form
      action={formAction}
      aria-busy={pending}
      noValidate
      className="space-y-3"
    >
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      <div className="space-y-1.5">
        <label
          htmlFor="role-title"
          className="block text-body-md font-medium text-on-surface"
        >
          Role title
        </label>
        <Input
          id="role-title"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="e.g. Backend Engineering Intern"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="role-company"
            className="block text-body-md font-medium text-on-surface"
          >
            Company{" "}
            <span className="text-on-surface-variant">(optional)</span>
          </label>
          <Input
            id="role-company"
            name="company"
            defaultValue={initial?.company ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="role-status"
            className="block text-body-md font-medium text-on-surface"
          >
            Status <span className="text-on-surface-variant">(optional)</span>
          </label>
          <Input
            id="role-status"
            name="status"
            defaultValue={initial?.status ?? ""}
            placeholder="e.g. Applied"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="role-text"
          className="block text-body-md font-medium text-on-surface"
        >
          Role description / job posting
        </label>
        <textarea
          id="role-text"
          name="rawText"
          rows={5}
          required
          defaultValue={initial?.rawText}
          placeholder="Paste the job description…"
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      {state && "error" in state ? (
        <p role="alert" className="text-body-md text-on-error-container">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : editing ? "Save changes" : "Add role"}
        </Button>
        {editing ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>

      <p role="status" className="sr-only">
        {pending ? "Saving…" : ""}
      </p>
    </form>
  );
}
