import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    interviewSession: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

import type { InterviewPlan } from "./planner";
import { createInterviewSession, getInterviewSessionForUser } from "./repository";

const session = vi.mocked(prisma.interviewSession);

const plan: InterviewPlan = {
  questions: [
    { questionText: "Q1", objective: "O1", rubric: ["a"] },
    { questionText: "Q2", objective: "O2", rubric: ["b"] },
    { questionText: "Q3", objective: "O3", rubric: ["c"] },
    { questionText: "Q4", objective: "O4", rubric: ["d"] },
    { questionText: "Q5", objective: "O5", rubric: ["e"] },
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
      orderIndex: 0,
    });
  });

  it("reads a session only for its owner, with questions in order", async () => {
    session.findFirst.mockResolvedValue(null as never);

    await getInterviewSessionForUser("user-1", "sess-9");

    expect(session.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "sess-9", userId: "user-1" },
        include: { questions: { orderBy: { orderIndex: "asc" } } },
      }),
    );
  });
});
