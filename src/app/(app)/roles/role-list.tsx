"use client";

import { Briefcase, CircleCheck, ListChecks, Pencil, Trash2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import type { TargetRoleSummary } from "./types";

function RequirementSummary({ role }: { role: TargetRoleSummary }) {
  if (!role.requirements) {
    return (
      <span className="inline-flex items-center gap-1.5 text-mono-label text-on-surface-variant">
        <span className="size-1.5 rounded-full bg-outline" aria-hidden="true" />
        Not analyzed yet
      </span>
    );
  }
  const total = role.requirements.requirements.length;
  const required = role.requirements.requirements.filter(
    (r) => r.importance === "required",
  ).length;
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-mono-label">
      <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
        <ListChecks className="size-3.5" aria-hidden="true" />
        {total} requirement{total === 1 ? "" : "s"}
      </span>
      <span className="inline-flex items-center gap-1.5 text-success">
        <CircleCheck className="size-3.5" aria-hidden="true" />
        {required} required
      </span>
    </span>
  );
}

export function RoleList({
  roles,
  onSelect,
  onEdit,
  onDelete,
}: {
  roles: TargetRoleSummary[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/50 px-6 py-10 text-center">
        <Briefcase className="size-6 text-on-surface-variant" aria-hidden="true" />
        <p className="max-w-xs text-body-md text-on-surface-variant">
          No target roles yet. Add one on the left — Companion will extract its
          requirements to aim your practice.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {roles.map((role) => (
        <li
          key={role.id}
          className={cn(
            "rounded-xl border bg-surface-container-lowest transition-colors",
            role.isActive
              ? "border-primary/50 ring-1 ring-primary/20"
              : "border-outline-variant hover:border-outline",
          )}
        >
          <div className="flex items-start gap-3 px-4 pt-4">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant"
              aria-hidden="true"
            >
              <Briefcase className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-body-md font-medium text-on-surface">
                  {role.title}
                </p>
                {role.isActive ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary-container/25 px-1.5 py-0.5 text-label-caps font-bold uppercase tracking-wide text-primary">
                    Loaded
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-mono-label text-on-surface-variant">
                {[role.company, role.status].filter(Boolean).join(" · ") ||
                  "No company set"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant px-4 py-2.5">
            <RequirementSummary role={role} />

            <div className="flex flex-wrap items-center gap-1">
              {!role.isActive ? (
                <button
                  type="button"
                  onClick={() => onSelect(role.id)}
                  className="inline-flex h-8 items-center rounded border border-outline-variant bg-surface-container-lowest px-3 text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Select
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onEdit(role.id)}
                className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-body-md text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </button>

              {confirmingId === role.id ? (
                <span
                  role="group"
                  aria-label={`Delete ${role.title}?`}
                  className="flex items-center gap-1"
                >
                  <span className="px-1 text-body-md text-on-surface-variant">
                    Delete?
                  </span>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => {
                      onDelete(role.id);
                      setConfirmingId(null);
                    }}
                    className="inline-flex h-8 items-center rounded border border-error/60 px-3 text-body-md font-medium text-error transition-colors hover:bg-error-container/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    className="inline-flex h-8 items-center rounded px-3 text-body-md text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(role.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-body-md text-on-surface-variant transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
