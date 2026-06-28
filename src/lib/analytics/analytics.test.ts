import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  emitFirstSessionCompleted,
  emitImprovedAnswerRead,
  emitPracticeDrillStarted,
  emitReportViewed,
  emitRepeatSession,
  resetAnalyticsSink,
  setAnalyticsSink,
  track,
  type AnalyticsEvent,
} from ".";

let events: AnalyticsEvent[];

beforeEach(() => {
  events = [];
  setAnalyticsSink({ record: (event) => void events.push(event) });
});
afterEach(() => resetAnalyticsSink());

describe("analytics sink", () => {
  it("routes tracked events to the configured sink", async () => {
    await track({ name: "report_viewed", userId: "u1", sessionId: "s1" });
    expect(events).toEqual([{ name: "report_viewed", userId: "u1", sessionId: "s1" }]);
  });

  it("carries only ids/metadata — never raw resume/transcript content", async () => {
    await track({ name: "report_viewed", userId: "u1", sessionId: "s1" });
    const allowed = new Set([
      "name",
      "userId",
      "sessionId",
      "priorSessionId",
    ]);
    for (const event of events) {
      for (const key of Object.keys(event)) {
        expect(allowed.has(key)).toBe(true);
        expect(String((event as Record<string, unknown>)[key]).length).toBeLessThan(64);
      }
    }
  });
});

describe("success-signal emitters", () => {
  it("fires first-session-completed only on the user's first completion", async () => {
    await emitFirstSessionCompleted({ userId: "u1", sessionId: "s2", completedSessionCount: 2 });
    expect(events).toHaveLength(0);

    await emitFirstSessionCompleted({ userId: "u1", sessionId: "s1", completedSessionCount: 1 });
    expect(events).toEqual([
      { name: "first_session_completed", userId: "u1", sessionId: "s1" },
    ]);
  });

  it("fires repeat-session only when a prior session is within 7 days", async () => {
    await emitRepeatSession({ userId: "u1", sessionId: "s2", priorSessionId: null });
    expect(events).toHaveLength(0);

    await emitRepeatSession({ userId: "u1", sessionId: "s2", priorSessionId: "s1" });
    expect(events).toEqual([
      {
        name: "repeat_session_within_7_days",
        userId: "u1",
        sessionId: "s2",
        priorSessionId: "s1",
      },
    ]);
  });

  it("fires report-viewed, improved-answer-read, and drill-started at their points", async () => {
    await emitReportViewed({ userId: "u1", sessionId: "s1" });
    await emitImprovedAnswerRead({ userId: "u1", sessionId: "s1" });
    await emitPracticeDrillStarted({ userId: "u1", sessionId: "s1" });

    expect(events.map((e) => e.name)).toEqual([
      "report_viewed",
      "improved_answer_read",
      "practice_drill_started",
    ]);
  });
});
