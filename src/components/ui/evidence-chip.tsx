import * as React from "react";

import { cn } from "@/lib/utils";

/** Amber tag used for tagging transcript evidence and resume snippets. */
export function EvidenceChip({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-evidence/15 px-2 py-0.5 text-label-caps font-bold uppercase tracking-wide text-on-evidence",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
