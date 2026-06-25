import { prisma } from "@/lib/prisma";

/** Ensures a User row exists for the Supabase auth user and returns it. */
export async function getOrCreateUser(authUser: {
  id: string;
  email?: string | null;
}) {
  return prisma.user.upsert({
    where: { id: authUser.id },
    update: {},
    create: { id: authUser.id, email: authUser.email ?? null },
  });
}
