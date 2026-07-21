"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

import {
  emitLandingPrimaryCtaSelected,
  emitLandingStorySelected,
  emitLandingViewed,
  emitSignInReached,
} from "@/lib/analytics";

export function LandingViewed() {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    void emitLandingViewed();
  }, []);

  return null;
}

export function SignInReached() {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    void emitSignInReached();
  }, []);

  return null;
}

export function MarketingAction({
  href,
  intent,
  className,
  children,
}: {
  href: string;
  intent: "primary" | "story";
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        void (intent === "primary"
          ? emitLandingPrimaryCtaSelected()
          : emitLandingStorySelected());
      }}
    >
      {children}
    </Link>
  );
}
