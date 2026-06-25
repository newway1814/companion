import { getUser } from "@/lib/auth";
import { listTargetRoles } from "@/lib/target-role/repository";

import {
  deleteTargetRoleAction,
  saveTargetRoleAction,
  selectTargetRoleAction,
} from "./actions";
import { RoleManager } from "./role-manager";
import type { TargetRoleSummary } from "./types";

export default async function RolesPage() {
  const user = await getUser();
  const rows = user ? await listTargetRoles(user.id) : [];

  const roles: TargetRoleSummary[] = rows.map((role) => ({
    id: role.id,
    title: role.title,
    company: role.company,
    status: role.status,
    rawText: role.rawText,
    isActive: role.isActive,
    createdAt: role.createdAt,
    lastUsedAt: role.lastUsedAt,
  }));

  return (
    <RoleManager
      roles={roles}
      saveAction={saveTargetRoleAction}
      onSelect={selectTargetRoleAction}
      onDelete={deleteTargetRoleAction}
    />
  );
}
