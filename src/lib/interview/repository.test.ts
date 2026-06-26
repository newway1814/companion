import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    interviewSession: {
      create: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
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
  createInterviewSession,
  getInterviewSessionForUser,
  recordAnswer,
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
