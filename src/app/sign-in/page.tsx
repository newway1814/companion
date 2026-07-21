import { redirect } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { SignInReached } from "@/components/marketing/marketing-analytics";
import { getUser } from "@/lib/auth";

import { CockpitSignature } from "./cockpit-signature";
import { SignInForm } from "./sign-in-form";

/** Faint instrument-grid hairlines, faded toward the edges with a radial mask. */
const gridStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
  maskImage:
    "radial-gradient(ellipse 78% 68% at 32% 42%, #000 25%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 78% 68% at 32% 42%, #000 25%, transparent 100%)",
  opacity: 0.4,
};

const tealGlow =
  "radial-gradient(circle, rgba(45,212,191,0.16) 0%, rgba(45,212,191,0) 70%)";

const footerLinks = ["Terms", "Privacy", "Help"] as const;

export default async function SignInPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
      <SignInReached />
      {/* Left — identity / cockpit (desktop only; condensed into the form pane on mobile) */}
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-outline-variant bg-surface-dim p-10 lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={gridStyle}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 size-[560px] rounded-full blur-3xl"
          style={{ background: tealGlow }}
        />

        <Reveal className="relative" y={10}>
          <p className="font-heading text-headline-sm font-bold text-primary">
            Companion
          </p>
          <p className="mt-1 font-mono text-mono-label uppercase tracking-[0.2em] text-on-surface-variant">
            Interview Research Studio
          </p>
        </Reveal>

        <Reveal className="relative" delay={0.14}>
          <CockpitSignature />
        </Reveal>

        <Reveal className="relative" delay={0.24}>
          <p className="max-w-sm text-body-md text-on-surface-variant">
            Companion presses your real resume — baseline, ownership, tradeoffs —
            before a real interviewer does.
          </p>
        </Reveal>
      </section>

      {/* Right — the magic-link form */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-14 sm:px-10">
        {/* On mobile the left pane is hidden, so carry a whisper of the glow here. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 size-[460px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl lg:hidden"
          style={{ background: tealGlow }}
        />

        <div className="relative w-full max-w-[420px]">
          {/* Condensed identity for mobile */}
          <div className="mb-10 lg:hidden">
            <p className="font-heading text-headline-sm font-bold text-primary">
              Companion
            </p>
            <p className="mt-1 font-mono text-mono-label uppercase tracking-[0.2em] text-on-surface-variant">
              Interview Research Studio
            </p>
            <p className="mt-4 text-body-md text-on-surface-variant">
              &ldquo;…significantly faster.&rdquo;{" "}
              <span className="text-on-surface">
                What was the baseline — and what did you build?
              </span>
            </p>
          </div>

          <Reveal>
            <SignInForm />
          </Reveal>

          <Reveal
            delay={0.12}
            className="mt-10 flex justify-center gap-6 text-body-md text-on-surface-variant"
          >
            {footerLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="rounded underline-offset-4 transition-colors hover:text-on-surface hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {label}
              </a>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
