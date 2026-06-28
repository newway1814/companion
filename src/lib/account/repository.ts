import { prisma } from "@/lib/prisma";

/**
 * Account-level data operations. Deletion is a hard delete: rows are removed
 * immediately and cascade to related data (sessions → questions/turns/report;
 * the user → everything). Every query is scoped to the acting user.
 */

/** The storage paths of the user's resume PDFs, for best-effort file cleanup. */
export async function listResumeStoragePaths(userId: string): Promise<string[]> {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    select: { storagePath: true },
  });
  return resumes
    .map((r) => r.storagePath)
    .filter((path): path is string => path != null);
}

/** Hard-deletes all of the user's resumes, target roles, and sessions. */
export function clearWorkspaceData(userId: string) {
  return prisma.$transaction([
    prisma.resume.deleteMany({ where: { userId } }),
    prisma.targetRole.deleteMany({ where: { userId } }),
    prisma.interviewSession.deleteMany({ where: { userId } }),
  ]);
}

/** Hard-deletes the user's account row, cascading every artifact they own. */
export function deleteUserData(userId: string) {
  return prisma.user.delete({ where: { id: userId } });
}

/** Loads the user's resumes, roles, and sessions for a data export. */
export async function getUserExportData(userId: string) {
  const [resumes, targetRoles, sessions] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, filename: true, source: true, createdAt: true },
    }),
    prisma.targetRole.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, company: true, createdAt: true },
    }),
    prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        questions: { orderBy: { orderIndex: "asc" } },
        turns: { orderBy: { orderIndex: "asc" } },
        report: {
          select: {
            readinessBand: true,
            readinessScore: true,
            reportJson: true,
          },
        },
      },
    }),
  ]);

  return { resumes, targetRoles, sessions };
}
