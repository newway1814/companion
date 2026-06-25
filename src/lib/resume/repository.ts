import { Prisma } from "@/generated/prisma/client";
import { ResumeSource } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

import type { ResumeProfile } from "./extraction";

/**
 * Data access for resumes. Every query is scoped by `userId`, which is the
 * per-user access boundary (Prisma connects with a privileged role that
 * bypasses RLS, so isolation is enforced here in application code).
 */

export function listResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createResume(input: {
  userId: string;
  filename: string;
  source: ResumeSource;
  rawText: string;
  storagePath?: string | null;
}) {
  // The first resume a user adds becomes their active one.
  const existing = await prisma.resume.count({ where: { userId: input.userId } });
  return prisma.resume.create({
    data: { ...input, isActive: existing === 0 },
  });
}

export function setResumeStoragePath(
  userId: string,
  id: string,
  storagePath: string,
) {
  return prisma.resume.updateMany({ where: { id, userId }, data: { storagePath } });
}

export function getResumeForUser(userId: string, id: string) {
  return prisma.resume.findFirst({ where: { id, userId } });
}

export function setResumeProfile(
  userId: string,
  id: string,
  profile: ResumeProfile,
) {
  return prisma.resume.updateMany({
    where: { id, userId },
    data: { parsedProfile: profile as unknown as Prisma.InputJsonValue },
  });
}

export function deleteResume(userId: string, id: string) {
  // updateMany/deleteMany scoped by userId means a user can only ever touch
  // their own rows — a foreign id simply matches nothing.
  return prisma.resume.deleteMany({ where: { id, userId } });
}

export async function setActiveResume(userId: string, id: string) {
  await prisma.$transaction([
    prisma.resume.updateMany({ where: { userId }, data: { isActive: false } }),
    prisma.resume.updateMany({
      where: { id, userId },
      data: { isActive: true, lastUsedAt: new Date() },
    }),
  ]);
}
