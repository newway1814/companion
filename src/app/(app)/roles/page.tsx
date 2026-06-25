import { getUser } from "@/lib/auth";
import { RoleRequirementsSchema } from "@/lib/target-role/extraction";
import { listTargetRoles } from "@/lib/target-role/repository";

import {
  analyzeRoleAction,
  deleteTargetRoleAction,
  saveTargetRoleAction,
  selectTargetRoleAction,
} from "./actions";
import { RoleManager } from "./role-manager";
import type { TargetRoleSummary } from "./types";

export default async function RolesPage() {
  const user = await getUser();
  const rows = user ? await listTargetRoles(user.id) : [];

  const roles: TargetRoleSummary[] = rows.map((role) => {
    const parsed = RoleRequirementsSchema.safeParse(role.parsedRequirements);
    return {
      id: role.id,
      title: role.title,
      company: role.company,
      status: role.status,
      rawText: role.rawText,
      isActive: role.isActive,
      createdAt: role.createdAt,
      lastUsedAt: role.lastUsedAt,
      requirements: parsed.success ? parsed.data : null,
    };
  });

  return (
    <RoleManager
      roles={roles}
      saveAction={saveTargetRoleAction}
      analyzeAction={analyzeRoleAction}
      onSelect={selectTargetRoleAction}
      onDelete={deleteTargetRoleAction}
    />
  );
}
