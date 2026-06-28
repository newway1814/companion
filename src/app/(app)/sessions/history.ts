import type { InterviewSessionStatus } from "@/generated/prisma/enums";

export type SessionRow = {
  id: string;
  createdAtISO: string;
  resumeName: string;
  roleTitle: string;
  readinessScore: number | null;
  readinessBand: string | null;
  statusLabel: string;
  hasReport: boolean;
};

const STATUS_LABELS: Record<InterviewSessionStatus, string> = {
  PLANNED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Complete",
};

type SessionInput = {
  id: string;
  createdAt: Date;
  status: InterviewSessionStatus;
  resume: { filename: string } | null;
  targetRole: { title: string } | null;
  report: { readinessBand: string; readinessScore: number } | null;
};

/** Maps persisted sessions into the rows the history table renders. */
export function buildSessionRows(sessions: SessionInput[]): SessionRow[] {
  return sessions.map((session) => ({
    id: session.id,
    createdAtISO: session.createdAt.toISOString(),
    resumeName: session.resume?.filename ?? "—",
    roleTitle: session.targetRole?.title ?? "—",
    readinessScore: session.report?.readinessScore ?? null,
    readinessBand: session.report?.readinessBand ?? null,
    statusLabel: STATUS_LABELS[session.status],
    hasReport: session.report != null,
  }));
}

/** Narrows the rows by a case-insensitive match on resume, role, or status. */
export function filterSessionRows(rows: SessionRow[], query: string): SessionRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    [row.resumeName, row.roleTitle, row.statusLabel]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
