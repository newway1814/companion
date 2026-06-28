import { describe, expect, it } from "vitest";

import { serializeUserExport } from "./export";

const data = {
  resumes: [
    {
      id: "r1",
      filename: "swe.pdf",
      source: "UPLOAD",
      createdAt: new Date("2026-06-20T10:00:00Z"),
    },
  ],
  targetRoles: [
    {
      id: "role1",
      title: "Backend Intern",
      company: "Acme",
      createdAt: new Date("2026-06-20T10:00:00Z"),
    },
  ],
  sessions: [
    {
      id: "s1",
      mode: "technical-project-deep-dive",
      status: "COMPLETED",
      createdAt: new Date("2026-06-21T10:00:00Z"),
      completedAt: new Date("2026-06-21T10:12:00Z"),
      questions: [
        { orderIndex: 0, questionText: "Walk me through it.", targetClaim: "Built X" },
      ],
      turns: [
        { speaker: "CANDIDATE", kind: "ANSWER", content: "I owned the pipeline." },
      ],
      report: { readinessBand: "solid", readinessScore: 68, reportJson: { ok: true } },
    },
  ],
};

describe("serializeUserExport", () => {
  it("produces a dated JSON export of sessions, transcripts, and feedback", () => {
    const out = serializeUserExport(data);

    expect(typeof out.exportedAt).toBe("string");
    expect(out.sessions[0].transcript[0].content).toBe("I owned the pipeline.");
    expect(out.sessions[0].report?.readinessScore).toBe(68);
    expect(out.resumes[0].filename).toBe("swe.pdf");
    expect(out.targetRoles[0].title).toBe("Backend Intern");
  });

  it("serializes dates as ISO strings so the export is plain JSON", () => {
    const out = serializeUserExport(data);

    expect(out.sessions[0].createdAt).toBe("2026-06-21T10:00:00.000Z");
    expect(() => JSON.stringify(out)).not.toThrow();
  });
});
