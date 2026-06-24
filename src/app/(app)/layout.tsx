import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defence-in-depth beyond the middleware: never render app surfaces without a user.
  const user = await getUser();
  if (!user) redirect("/sign-in");

  return <AppShell>{children}</AppShell>;
}
