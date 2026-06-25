import type { RoleRequirements } from "@/lib/target-role/extraction";

export type TargetRoleFormState = { ok: true } | { error: string } | null;

export type AnalyzeRoleState = { error?: string } | null;

export type AnalyzeRoleAction = (
  state: AnalyzeRoleState,
  formData: FormData,
) => Promise<AnalyzeRoleState>;

export type SaveTargetRoleAction = (
  state: TargetRoleFormState,
  formData: FormData,
) => Promise<TargetRoleFormState>;

/** Serializable target-role fields passed to client components. */
export type TargetRoleSummary = {
  id: string;
  title: string;
  company: string | null;
  status: string | null;
  rawText: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
  requirements: RoleRequirements | null;
};
