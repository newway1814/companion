import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    interviewSession: { findFirst: vi.fn() },
    feedbackReport: { upsert: vi.fn(), findFirst: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";

import type { CoachingReport } from "./report";
import { getFeedbackReport, saveFeedbackReport } from "./report-repository";

const session = vi.mocked(prisma.interviewSession);
const report = vi.mocked(prisma.feedbackReport);

const fixture: CoachingReport = {
  readiness: { band: "solid", score: 68, summary: "Solid." },
  answerScores: [],
  technicalDepth: [],
  claimDefenseVulnerabilities: [],
  suggestedReframing: [],
  nextPractice: { focus: "Metrics", drill: "Re-answer with a baseline." },
};

describe("feedback report repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("persists the report for the owner, flattening readiness for querying", async () => {
    session.findFirst.mockResolvedValue({ id: "sess-1" } as never);
    report.upsert.mockResolvedValue({ id: "rep-1" } as never);

    await saveFeedbackReport("user-1", "sess-1", fixture);

    expect(session.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "sess-1", userId: "user-1" } }),
    );
    const arg = report.upsert.mock.calls[0][0] as {
      where: { sessionId: string };
      create: { readinessBand: string; readinessScore: number };
    };
    expect(arg.where).toEqual({ sessionId: "sess-1" });
    expect(arg.create.readinessBand).toBe("solid");
    expect(arg.create.readinessScore).toBe(68);
  });

  it("writes nothing when the session is not the user's", async () => {
    session.findFirst.mockResolvedValue(null as never);

    const result = await saveFeedbackReport("user-1", "sess-x", fixture);

    expect(result).toBeNull();
    expect(report.upsert).not.toHaveBeenCalled();
  });

  it("reads a report only through the owning session", async () => {
    report.findFirst.mockResolvedValue(null as never);

    await getFeedbackReport("user-1", "sess-1");

    expect(report.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { sessionId: "sess-1", session: { userId: "user-1" } },
      }),
    );
  });
});
