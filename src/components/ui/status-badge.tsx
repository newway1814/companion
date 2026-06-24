import { Check, CircleDashed, TriangleAlert, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type Status = "verified" | "missing" | "incomplete" | "warning";

const config: Record<
  Status,
  { label: string; Icon: typeof Check; className: string }
> = {
  verified: {
    label: "Verified",
    Icon: Check,
    className: "bg-success/15 text-success",
  },
  missing: {
    label: "Missing",
    Icon: X,
    className: "bg-error/15 text-on-error-container",
  },
  incomplete: {
    label: "Incomplete",
    Icon: CircleDashed,
    className: "bg-secondary-container/25 text-on-secondary-container",
  },
  warning: {
    label: "Warning",
    Icon: TriangleAlert,
    className: "bg-secondary-container/25 text-on-secondary-container",
  },
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status;
  /** Override the default status word. */
  label?: string;
}

export function StatusBadge({
  status,
  label,
  className,
  ...props
}: StatusBadgeProps) {
  const { label: defaultLabel, Icon, className: statusClass } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-label-caps font-bold uppercase tracking-wide",
        statusClass,
        className,
      )}
      {...props}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label ?? defaultLabel}
    </span>
  );
}
