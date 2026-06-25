import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth";

import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center px-gutter py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-heading text-display-lg text-primary">
            Companion
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Interview Research Studio
          </p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 md:p-10">
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

        <div className="mt-8 flex justify-center gap-6 text-body-md text-on-surface-variant">
          {["Terms of Service", "Privacy Policy", "Help Center"].map((label) => (
            <a
              key={label}
              href="#"
              className="rounded hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
