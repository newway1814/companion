import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    interviewSession: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    interviewTurn: {
      count: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(async (ops: unknown[]) => Promise.all(ops)),
  },
}));

import { prisma } from "@/lib/prisma";

import type { InterviewPlan } from "./planner";
import {
  countCompletedSessions,
  createInterviewSession,
  deleteInterviewSession,
  findRecentSessionId,
  getInterviewSessionForUser,
  listSessionsForUser,
  markSessionComplete,
  recordAnswer,
  recordFollowUp,
} from "./repository";

const session = vi.mocked(prisma.interviewSession);
const turn = vi.mocked(prisma.interviewTurn);

const plan: InterviewPlan = {
  questions: [
    { questionText: "Q1", objective: "O1", targetClaim: "C1", rubric: ["a"] },
    { questionText: "Q2", objective: "O2", targetClaim: "C2", rubric: ["b"] },
    { questionText: "Q3", objective: "O3", targetClaim: "C3", rubric: ["c"] },
    { questionText: "Q4", objective: "O4", targetClaim: "C4", rubric: ["d"] },
    { questionText: "Q5", objective: "O5", targetClaim: "C5", rubric: ["e"] },
  ],
};

describe("interview session repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("persists the session for its owner with the plan's questions in order", async () => {
    session.create.mockResolvedValue({ id: "sess-1" } as never);

    await createInterviewSession({
      userId: "user-1",
      resumeId: "resume-1",
      targetRoleId: "role-1",
      plan,
    });

    expect(session.create).toHaveBeenCalledOnce();
    const data = session.create.mock.calls[0][0].data as {
      userId: string;
      resumeId: string;
      targetRoleId: string;
      questions: { create: { orderIndex: number; questionText: string; objective: string }[] };
    };
    expect(data).toMatchObject({
      userId: "user-1",
      resumeId: "resume-1",
      targetRoleId: "role-1",
    });
    const created = data.questions.create;
    expect(created).toHaveLength(5);
    expect(created.map((q) => q.orderIndex)).toEqual([0, 1, 2, 3, 4]);
    expect(created[0]).toMatchObject({
      questionText: "Q1",
      objective: "O1",
      targetClaim: "C1",
      orderIndex: 0,
    });
  });

  it("reads a session only for its owner, with questions and turns in order", async () => {
    session.findFirst.mockResolvedValue(null as never);

    await getInterviewSessionForUser("user-1", "sess-9");

    expect(session.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "sess-9", userId: "user-1" },
        include: {
          questions: { orderBy: { orderIndex: "asc" } },
          turns: { orderBy: { orderIndex: "asc" } },
        },
      }),
    );
  });
});

describe("recordAnswer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("appends a candidate answer turn at the next order index for the owner", async () => {
    session.findFirst.mockResolvedValue({ id: "sess-1" } as never);
    turn.count.mockResolvedValue(2 as never);
    turn.create.mockResolvedValue({ id: "turn-3" } as never);

    await recordAnswer({
      userId: "user-1",
      sessionId: "sess-1",
      questionId: "q-1",
      transcript: "I owned the ingestion path.",
      durationSeconds: 30,
    });

    // Ownership is verified before any write.
    expect(session.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "sess-1", userId: "user-1" } }),
    );
    expect(turn.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sessionId: "sess-1",
          questionId: "q-1",
          speaker: "CANDIDATE",
          kind: "ANSWER",
          content: "I owned the ingestion path.",
          durationSeconds: 30,
          orderIndex: 2,
        }),
      }),
    );
    // The session moves into progress.
    expect(session.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "sess-1", userId: "user-1" },
        data: expect.objectContaining({ status: "IN_PROGRESS" }),
      }),
    );
  });

  it("writes nothing when the session is not the user's", async () => {
    session.findFirst.mockResolvedValue(null as never);

    const result = await recordAnswer({
      userId: "user-1",
      sessionId: "sess-x",
      questionId: "q-1",
      transcript: "hello",
      durationSeconds: 1,
    });

    expect(result).toBeNull();
    expect(turn.create).not.toHaveBeenCalled();
  });
});

describe("analytics signals", () => {
  beforeEach(() => vi.clearAllMocks());

  it("counts only the user's completed sessions", () => {
    countCompletedSessions("user-1");

    expect(session.count).toHaveBeenCalledWith({
      where: { userId: "user-1", status: "COMPLETED" },
    });
  });

  it("finds a prior session within the window, scoped and excluding the current", async () => {
    session.findFirst.mockResolvedValue({ id: "prev" } as never);

    const id = await findRecentSessionId("user-1", 7, "current");

    expect(id).toBe("prev");
    const arg = session.findFirst.mock.calls[0][0] as {
      where: { userId: string; id: { not: string }; createdAt: { gte: Date } };
    };
    expect(arg.where.userId).toBe("user-1");
    expect(arg.where.id).toEqual({ not: "current" });
    expect(arg.where.createdAt.gte).toBeInstanceOf(Date);
  });

  it("returns null when there is no recent prior session", async () => {
    session.findFirst.mockResolvedValue(null as never);
    expect(await findRecentSessionId("user-1", 7, "current")).toBeNull();
  });
});

describe("session history scoping", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists only the user's sessions, newest first, with resume/role/report", () => {
    listSessionsForUser("user-1");

    expect(session.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      }),
    );
    const arg = session.findMany.mock.calls[0][0] as { include: object };
    expect(arg.include).toMatchObject({
      resume: expect.anything(),
      targetRole: expect.anything(),
      report: expect.anything(),
    });
  });

  it("deletes only the owner's session", () => {
    deleteInterviewSession("user-1", "sess-9");

    expect(session.deleteMany).toHaveBeenCalledWith({
      where: { id: "sess-9", userId: "user-1" },
    });
  });
});

describe("recordFollowUp", () => {
  beforeEach(() => vi.clearAllMocks());

  it("appends an interviewer follow-up turn with challenge metadata for the owner", async () => {
    session.findFirst.mockResolvedValue({ id: "sess-1" } as never);
    turn.count.mockResolvedValue(1 as never);
    turn.create.mockResolvedValue({ id: "turn-2" } as never);

    await recordFollowUp({
      userId: "user-1",
      sessionId: "sess-1",
      questionId: "q-1",
      question: "What was the baseline latency?",
      challenge: {
        reason: "Missing baseline.",
        weakSpan: "I improved performance.",
        challengedClaim: "Reduced API latency by 40%",
        improvementChips: ["Add a baseline"],
      },
    });

    expect(turn.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sessionId: "sess-1",
          questionId: "q-1",
          speaker: "INTERVIEWER",
          kind: "FOLLOW_UP",
          content: "What was the baseline latency?",
          orderIndex: 1,
          challenge: expect.objectContaining({
            challengedClaim: "Reduced API latency by 40%",
          }),
        }),
      }),
    );
  });

  it("writes nothing when the session is not the user's", async () => {
    session.findFirst.mockResolvedValue(null as never);

    const result = await recordFollowUp({
      userId: "user-1",
      sessionId: "sess-x",
      questionId: "q-1",
      question: "?",
      challenge: {
        reason: "",
        weakSpan: "",
        challengedClaim: "",
        improvementChips: [],
      },
    });

    expect(result).toBeNull();
    expect(turn.create).not.toHaveBeenCalled();
  });
});

describe("markSessionComplete", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks the owner's session complete with a completion time", () => {
    markSessionComplete("user-1", "sess-1");

    expect(session.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "sess-1", userId: "user-1" },
        data: expect.objectContaining({
          status: "COMPLETED",
          completedAt: expect.any(Date),
        }),
      }),
    );
  });
});
