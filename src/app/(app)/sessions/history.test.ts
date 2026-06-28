import { describe, expect, it } from "vitest";

import { buildSessionRows, filterSessionRows } from "./history";

const sessions = [
  {
    id: "s1",
    createdAt: new Date("2026-06-20T10:00:00Z"),
    status: "COMPLETED" as const,
    resume: { filename: "swe-resume.pdf" },
    targetRole: { title: "Backend Intern" },
    report: { readinessBand: "solid", readinessScore: 68 },
  },
  {
    id: "s2",
    createdAt: new Date("2026-06-21T10:00:00Z"),
    status: "IN_PROGRESS" as const,
    resume: { filename: "frontend.pdf" },
    targetRole: { title: "UI Engineer" },
    report: null,
  },
];

describe("buildSessionRows", () => {
  it("maps sessions to rows with resume, role, readiness, and status", () => {
    const rows = buildSessionRows(sessions);

    expect(rows[0]).toMatchObject({
      id: "s1",
      resumeName: "swe-resume.pdf",
      roleTitle: "Backend Intern",
      readinessScore: 68,
      readinessBand: "solid",
      statusLabel: "Complete",
      hasReport: true,
    });
    expect(rows[1]).toMatchObject({
      readinessScore: null,
      statusLabel: "In progress",
      hasReport: false,
    });
  });

  it("tolerates a missing resume or role", () => {
    const rows = buildSessionRows([
      { ...sessions[0], resume: null, targetRole: null },
    ]);

    expect(rows[0].resumeName).toBe("—");
    expect(rows[0].roleTitle).toBe("—");
  });
});

describe("filterSessionRows", () => {
  const rows = buildSessionRows(sessions);

  it("returns everything for an empty query", () => {
    expect(filterSessionRows(rows, "")).toHaveLength(2);
  });

  it("narrows by resume, role, or status, case-insensitively", () => {
    expect(filterSessionRows(rows, "backend")).toHaveLength(1);
    expect(filterSessionRows(rows, "ui engineer")[0].id).toBe("s2");
    expect(filterSessionRows(rows, "complete")[0].id).toBe("s1");
  });
});
