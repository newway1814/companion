import { redirect } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { getUser } from "@/lib/auth";

import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-gutter py-12">
      {/* Ambient teal glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.18) 0%, rgba(45,212,191,0) 70%)",
        }}
      />

      <div className="relative w-full max-w-[460px]">
        <Reveal className="mb-10 text-center" y={12}>
          <h1 className="mb-2 font-heading text-display-lg text-primary">
            Companion
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Interview Research Studio
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest/80 p-8 backdrop-blur-sm md:p-10">
            <div className="mb-8 text-center">
              <h2 className="mb-2 font-heading text-headline-sm text-on-surface">
                Welcome back
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Sign in to access your interview workspace.
              </p>
            </div>

            <SignInForm />
          </div>
        </Reveal>

        <Reveal
          delay={0.16}
          className="mt-8 flex justify-center gap-6 text-body-md text-on-surface-variant"
        >
          {["Terms of Service", "Privacy Policy", "Help Center"].map((label) => (
            <a
              key={label}
              href="#"
              className="rounded transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {label}
            </a>
          ))}
        </Reveal>
      </div>
    </main>
  );
}
