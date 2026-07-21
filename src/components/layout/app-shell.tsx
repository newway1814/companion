"use client";

import {
  FileText,
  History,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Plus,
  Settings,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/roles", label: "Target roles", icon: Target },
  { href: "/sessions", label: "Session history", icon: History },
] as const;

const footerNav = [{ href: "/settings", label: "Settings", icon: Settings }] as const;

export function isActive(pathname: string, href: string) {
  // Match the exact route or a nested child, but not prefix siblings
  // (e.g. "/roles" must not light up for "/roles-archive").
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = React.useState(false);
  const firstNavRef = React.useRef<HTMLAnchorElement>(null);

  // When the mobile drawer opens, move focus into it and allow Escape to close.
  React.useEffect(() => {
    if (!open) return;
    firstNavRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const navLink = (item: (typeof primaryNav)[number] | (typeof footerNav)[number]) => {
    const active = isActive(pathname, item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-2 text-body-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          active
            ? "bg-surface-container-low font-semibold text-primary"
            : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-full">
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-outline-variant bg-surface px-4 md:hidden">
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="app-sidebar"
          onClick={() => setOpen((value) => !value)}
          className="rounded p-1 text-on-surface-variant hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        <span className="font-heading text-section-title font-semibold text-primary">
          Companion
        </span>
      </header>

      {/* Backdrop for the mobile drawer */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Sidebar (off-canvas on mobile, docked on desktop) */}
      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-sidebar-width flex-col border-r border-outline-variant bg-surface py-gutter transition-transform md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="mb-8 px-gutter">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <Lightbulb className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-heading text-section-title font-bold text-primary">
                Companion
              </p>
              <p className="text-label-caps uppercase tracking-wider text-on-surface-variant">
                Interview Research Studio
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mb-6 px-gutter">
          <Link
            ref={firstNavRef}
            href="/setup"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded bg-primary-container px-4 py-2 text-body-md font-medium text-on-primary transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Plus className="size-5" aria-hidden="true" />
            New session
          </Link>
        </div>

        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-4">
          {primaryNav.map(navLink)}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant px-4 pt-4">
          {footerNav.map(navLink)}
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <LogOut className="size-5" aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content region */}
      <div className="flex min-w-0 flex-1 flex-col pt-14 md:pt-0">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
