import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import type { InterviewPlan } from "./planner";

/**
 * Data access for interview sessions. Every query is scoped by `userId` — the
 * per-user access boundary (Prisma bypasses RLS, so isolation is enforced here).
 */

/**
 * Freezes a generated plan into a persisted session and its ordered questions
 * in a single write, so the room never opens against a half-written plan.
 */
export function createInterviewSession(input: {
  userId: string;
  resumeId: string;
  targetRoleId: string;
  plan: InterviewPlan;
  mode?: string;
}) {
  return prisma.interviewSession.create({
    data: {
      userId: input.userId,
      resumeId: input.resumeId,
      targetRoleId: input.targetRoleId,
      ...(input.mode ? { mode: input.mode } : {}),
      questions: {
        create: input.plan.questions.map((question, index) => ({
          orderIndex: index,
          questionText: question.questionText,
          objective: question.objective,
          rubric: question.rubric as unknown as Prisma.InputJsonValue,
        })),
      },
    },
  });
}

/** Reads one session and its ordered questions, scoped to the owner. */
export function getInterviewSessionForUser(userId: string, id: string) {
  return prisma.interviewSession.findFirst({
    where: { id, userId },
    include: { questions: { orderBy: { orderIndex: "asc" } } },
  });
}
