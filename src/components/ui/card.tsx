import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional section title rendered as a heading. */
  title?: string;
}

/** Level-1 surface: white card with a 1px border and 8px radius. */
export function Card({ title, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-outline-variant bg-surface-container-lowest p-6",
        className,
      )}
      {...props}
    >
      {title ? (
        <h3 className="mb-3 font-heading text-section-title text-on-surface">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}

/** Workspace panel: a flush container delimited by 1px borders (no shadow). */
export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-outline-variant bg-surface-container-lowest",
        className,
      )}
      {...props}
    />
  );
}
