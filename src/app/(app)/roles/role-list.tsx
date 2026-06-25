"use client";

import { Briefcase, Pencil, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { TargetRoleSummary } from "./types";

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
      <p className="text-body-md text-on-surface-variant">
        No target roles yet. Add one to get started.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {roles.map((role) => (
        <li
          key={role.id}
          className={cn(
            "rounded-lg border p-3",
            role.isActive
              ? "border-primary bg-surface-container-low"
              : "border-outline-variant",
          )}
        >
          <div className="flex items-start gap-2">
            <Briefcase
              className="mt-0.5 size-4 shrink-0 text-on-surface-variant"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-md text-on-surface">{role.title}</p>
              <p className="text-mono-label text-on-surface-variant">
                {[role.company, role.status].filter(Boolean).join(" · ") ||
                  "No company set"}
              </p>
            </div>
            {role.isActive ? (
              <span className="text-label-caps uppercase tracking-wide text-primary">
                Active
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!role.isActive ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelect(role.id)}
              >
                Select
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => onEdit(role.id)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Button>

            {confirmingId === role.id ? (
              <span
                role="group"
                aria-label={`Delete ${role.title}?`}
                className="flex items-center gap-2"
              >
                <span className="text-body-md text-on-surface-variant">
                  Delete this role?
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  autoFocus
                  className="border-error text-error"
                  onClick={() => {
                    onDelete(role.id);
                    setConfirmingId(null);
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingId(null)}
                >
                  Cancel
                </Button>
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-error"
                onClick={() => setConfirmingId(role.id)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
