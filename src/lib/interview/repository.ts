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
          targetClaim: question.targetClaim,
          rubric: question.rubric as unknown as Prisma.InputJsonValue,
        })),
      },
    },
  });
}

/**
 * Records a candidate's answer as the next transcript turn, scoped to the
 * session owner, and moves the session into progress. Returns the created turn,
 * or null if the session is not the user's. The answer is stored as an
 * ANSWER-kind turn (the transcript timeline reads turns) carrying its duration.
 */
export async function recordAnswer(input: {
  userId: string;
  sessionId: string;
  questionId: string;
  transcript: string;
  durationSeconds: number;
}) {
  const session = await prisma.interviewSession.findFirst({
    where: { id: input.sessionId, userId: input.userId },
    select: { id: true },
  });
  if (!session) return null;

  const orderIndex = await prisma.interviewTurn.count({
    where: { sessionId: input.sessionId },
  });

  const [turn] = await prisma.$transaction([
    prisma.interviewTurn.create({
      data: {
        sessionId: input.sessionId,
        questionId: input.questionId,
        speaker: "CANDIDATE",
        kind: "ANSWER",
        content: input.transcript,
        durationSeconds: input.durationSeconds,
        orderIndex,
      },
    }),
    prisma.interviewSession.updateMany({
      where: { id: input.sessionId, userId: input.userId },
      data: { status: "IN_PROGRESS" },
    }),
    prisma.interviewSession.updateMany({
      where: { id: input.sessionId, userId: input.userId, startedAt: null },
      data: { startedAt: new Date() },
    }),
  ]);

  return turn;
}

/**
 * Records an adaptive follow-up as an interviewer turn, scoped to the session
 * owner, carrying the challenge metadata (reason, weak span, claim, chips).
 * Returns the created turn, or null if the session is not the user's.
 */
export async function recordFollowUp(input: {
  userId: string;
  sessionId: string;
  questionId: string;
  question: string;
  challenge: {
    reason: string;
    weakSpan: string;
    challengedClaim: string;
    improvementChips: string[];
  };
}) {
  const session = await prisma.interviewSession.findFirst({
    where: { id: input.sessionId, userId: input.userId },
    select: { id: true },
  });
  if (!session) return null;

  const orderIndex = await prisma.interviewTurn.count({
    where: { sessionId: input.sessionId },
  });

  return prisma.interviewTurn.create({
    data: {
      sessionId: input.sessionId,
      questionId: input.questionId,
      speaker: "INTERVIEWER",
      kind: "FOLLOW_UP",
      content: input.question,
      challenge: input.challenge as unknown as Prisma.InputJsonValue,
      orderIndex,
    },
  });
}

/** Lists the user's sessions (newest first) with the data the history table shows. */
export function listSessionsForUser(userId: string) {
  return prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      resume: { select: { filename: true } },
      targetRole: { select: { title: true } },
      report: { select: { readinessBand: true, readinessScore: true } },
    },
  });
}

/** Deletes one session, scoped to the owner (cascades questions/turns/report). */
export function deleteInterviewSession(userId: string, id: string) {
  return prisma.interviewSession.deleteMany({ where: { id, userId } });
}

/** Marks the owner's session complete once the five-question run resolves. */
export function markSessionComplete(userId: string, id: string) {
  return prisma.interviewSession.updateMany({
    where: { id, userId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}

/** Reads one session and its ordered questions, scoped to the owner. */
export function getInterviewSessionForUser(userId: string, id: string) {
  return prisma.interviewSession.findFirst({
    where: { id, userId },
    include: {
      questions: { orderBy: { orderIndex: "asc" } },
      turns: { orderBy: { orderIndex: "asc" } },
    },
  });
}

/** Reads a session with its target role for coaching-report generation. */
export function getSessionForReport(userId: string, id: string) {
  return prisma.interviewSession.findFirst({
    where: { id, userId },
    include: {
      questions: { orderBy: { orderIndex: "asc" } },
      turns: { orderBy: { orderIndex: "asc" } },
      targetRole: { select: { title: true } },
    },
  });
}
