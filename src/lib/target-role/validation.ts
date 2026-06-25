export const MAX_ROLE_TITLE = 200;

export type TargetRoleValidation = { ok: true } | { ok: false; error: string };

/** Validates the user-entered fields for a target role. */
export function validateTargetRoleInput(input: {
  title: string;
  rawText: string;
}): TargetRoleValidation {
  if (!input.title.trim()) {
    return { ok: false, error: "Add a role title." };
  }
  if (input.title.length > MAX_ROLE_TITLE) {
    return { ok: false, error: "That title is too long." };
  }
  if (!input.rawText.trim()) {
    return { ok: false, error: "Paste the role description or job posting." };
  }
  return { ok: true };
}
