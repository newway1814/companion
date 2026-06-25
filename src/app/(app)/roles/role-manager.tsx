"use client";

import * as React from "react";

import { RoleDetail } from "./role-detail";
import { RoleForm } from "./role-form";
import { RoleList } from "./role-list";
import type { SaveTargetRoleAction, TargetRoleSummary } from "./types";

export function RoleManager({
  roles,
  saveAction,
  onSelect,
  onDelete,
}: {
  roles: TargetRoleSummary[];
  saveAction: SaveTargetRoleAction;
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
    <div className="grid gap-gutter p-gutter md:grid-cols-[360px_1fr]">
      <section aria-label="Target role library" className="space-y-8">
        <div>
          <h2 className="mb-3 font-heading text-section-title text-on-surface">
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

      <section
        aria-label="Selected role"
        className="md:border-l md:border-outline-variant md:pl-gutter"
      >
        <RoleDetail role={active} />
      </section>
    </div>
  );
}
