import type { TargetRoleSummary } from "./types";

export function RoleDetail({ role }: { role: TargetRoleSummary | null }) {
  if (!role) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-outline-variant p-8 text-center text-body-md text-on-surface-variant">
        Select or add a target role to see its details.
      </div>
    );
  }

  const meta = [role.company, role.status].filter(Boolean).join(" · ");

  return (
    <div>
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Target role
      </p>
      <h1 className="font-heading text-display-md text-on-surface">
        {role.title}
      </h1>
      {meta ? (
        <p className="mt-1 text-body-md text-on-surface-variant">{meta}</p>
      ) : null}
      <div className="mt-4 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-body-md text-on-surface">
        {role.rawText}
      </div>
    </div>
  );
}
