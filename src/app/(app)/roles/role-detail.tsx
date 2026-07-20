import { Target } from "lucide-react";

import type { TargetRoleSummary } from "./types";

export function RoleDetail({ role }: { role: TargetRoleSummary | null }) {
  if (!role) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/50 p-8 text-center">
        <Target className="size-6 text-on-surface-variant" aria-hidden="true" />
        <p className="max-w-xs text-body-md text-on-surface-variant">
          Select or add a target role to see its description and requirements.
        </p>
      </div>
    );
  }

  const meta = [role.company, role.status].filter(Boolean).join(" · ");

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
      <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
        Loaded role
      </p>
      <h2 className="mt-1 font-heading text-headline-sm text-on-surface">
        {role.title}
      </h2>
      {meta ? (
        <p className="mt-1 text-body-md text-on-surface-variant">{meta}</p>
      ) : null}
      <details className="group mt-4">
        <summary className="cursor-pointer list-none text-body-md text-primary transition-colors hover:underline">
          <span className="group-open:hidden">Show role description</span>
          <span className="hidden group-open:inline">Hide role description</span>
        </summary>
        <div className="mt-3 max-h-[50vh] overflow-auto whitespace-pre-wrap rounded-lg border border-outline-variant bg-surface p-4 text-body-md text-on-surface">
          {role.rawText}
        </div>
      </details>
    </div>
  );
}
