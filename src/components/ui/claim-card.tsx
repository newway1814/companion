import * as React from "react";

import { cn } from "@/lib/utils";

type ClaimVariant = "verified" | "hypothesis";

const accentClasses: Record<ClaimVariant, string> = {
  verified: "border-l-primary-container",
  hypothesis: "border-l-evidence",
};

export interface ClaimCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /** Teal accent for verified claims, amber for unproven hypotheses. */
  variant?: ClaimVariant;
}

/** White card with a 4px left accent bar, used for resume project claims. */
export function ClaimCard({
  title,
  variant = "hypothesis",
  className,
  children,
  ...props
}: ClaimCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 border-outline-variant bg-surface-container-lowest p-4",
        accentClasses[variant],
        className,
      )}
      {...props}
    >
      {title ? (
        <h4 className="mb-1 font-heading text-section-title text-on-surface">
          {title}
        </h4>
      ) : null}
      {children}
    </div>
  );
}
