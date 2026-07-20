"use client";

import * as React from "react";

import { RoleAnalysis } from "./role-analysis";
import { RoleDetail } from "./role-detail";
import { RoleForm } from "./role-form";
import { RoleList } from "./role-list";
import type {
  AnalyzeRoleAction,
  SaveTargetRoleAction,
  TargetRoleSummary,
} from "./types";

export function RoleManager({
  roles,
  saveAction,
  analyzeAction,
  onSelect,
  onDelete,
}: {
  roles: TargetRoleSummary[];
  saveAction: SaveTargetRoleAction;
  analyzeAction: AnalyzeRoleAction;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formKey, setFormKey] = React.useState(0);

  const editing = editingId
    ? (roles.find((role) => role.id === editingId) ?? null)
    : null;
  const active = roles.find((role) => role.isActive) ?? null;

  function resetForm() {
    setEditingId(null);
    setFormKey((key) => key + 1);
  }

  return (
    <div className="mx-auto max-w-5xl p-gutter">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-display-md text-on-surface">
            Target roles
          </h1>
          <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">
            The role you&apos;re aiming at. Companion reads its requirements to
            steer which claims get pressure-tested.
          </p>
        </div>
        {roles.length > 0 ? (
          <p className="shrink-0 text-mono-label text-on-surface-variant">
            {roles.length} saved
            {active ? " · 1 loaded" : ""}
          </p>
        ) : null}
      </header>

      <div className="mt-8 grid gap-gutter md:grid-cols-[minmax(0,360px)_1fr] md:items-start">
        <section aria-label="Target role library" className="space-y-8">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 font-heading text-section-title text-on-surface">
              {editing ? "Edit role" : "Add a target role"}
            </h2>
            <RoleForm
              key={`${editingId ?? "new"}-${formKey}`}
              initial={editing}
              action={saveAction}
              onDone={resetForm}
              onCancel={resetForm}
            />
          </div>
          <div>
            <h2 className="mb-3 font-heading text-section-title text-on-surface">
              Saved roles
            </h2>
            <RoleList
              roles={roles}
              onSelect={onSelect}
              onEdit={setEditingId}
              onDelete={onDelete}
            />
          </div>
        </section>

        <section aria-label="Selected role">
          <RoleDetail role={active} />
          {active ? (
            <RoleAnalysis
              roleId={active.id}
              requirements={active.requirements}
              action={analyzeAction}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
