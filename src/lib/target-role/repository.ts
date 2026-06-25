import { prisma } from "@/lib/prisma";

/**
 * Data access for target roles. Every query is scoped by `userId` — the
 * per-user access boundary (Prisma bypasses RLS, so isolation is enforced here).
 */

export function listTargetRoles(userId: string) {
  return prisma.targetRole.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getTargetRoleForUser(userId: string, id: string) {
  return prisma.targetRole.findFirst({ where: { id, userId } });
}

export async function createTargetRole(input: {
  userId: string;
  title: string;
  company?: string | null;
  status?: string | null;
  rawText: string;
}) {
  const existing = await prisma.targetRole.count({
    where: { userId: input.userId },
  });
  return prisma.targetRole.create({
    data: { ...input, isActive: existing === 0 },
  });
}

export function updateTargetRole(
  userId: string,
  id: string,
  data: {
    title: string;
    company?: string | null;
    status?: string | null;
    rawText: string;
  },
) {
  return prisma.targetRole.updateMany({ where: { id, userId }, data });
}

export function deleteTargetRole(userId: string, id: string) {
  return prisma.targetRole.deleteMany({ where: { id, userId } });
}

export async function setActiveTargetRole(userId: string, id: string) {
  await prisma.$transaction([
    prisma.targetRole.updateMany({ where: { userId }, data: { isActive: false } }),
    prisma.targetRole.updateMany({
      where: { id, userId },
      data: { isActive: true, lastUsedAt: new Date() },
    }),
  ]);
}
