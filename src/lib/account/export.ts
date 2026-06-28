type ResumeExport = {
  id: string;
  filename: string;
  source: string;
  createdAt: Date;
};

type RoleExport = {
  id: string;
  title: string;
  company: string | null;
  createdAt: Date;
};

type SessionExport = {
  id: string;
  mode: string;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
  questions: {
    orderIndex: number;
    questionText: string;
    targetClaim: string;
  }[];
  turns: { speaker: string; kind: string; content: string }[];
  report: {
    readinessBand: string;
    readinessScore: number;
    reportJson: unknown;
  } | null;
};

/**
 * Serializes a user's data into a plain JSON export — their sessions,
 * transcripts, and coaching feedback, plus resume/role metadata. This is the
 * user downloading their own data, so transcripts are included; dates become
 * ISO strings so the result is portable JSON.
 */
export function serializeUserExport(data: {
  resumes: ResumeExport[];
  targetRoles: RoleExport[];
  sessions: SessionExport[];
}) {
  return {
    exportedAt: new Date().toISOString(),
    resumes: data.resumes.map((resume) => ({
      id: resume.id,
      filename: resume.filename,
      source: resume.source,
      createdAt: resume.createdAt.toISOString(),
    })),
    targetRoles: data.targetRoles.map((role) => ({
      id: role.id,
      title: role.title,
      company: role.company,
      createdAt: role.createdAt.toISOString(),
    })),
    sessions: data.sessions.map((session) => ({
      id: session.id,
      mode: session.mode,
      status: session.status,
      createdAt: session.createdAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
      questions: session.questions.map((q) => ({
        orderIndex: q.orderIndex,
        questionText: q.questionText,
        targetClaim: q.targetClaim,
      })),
      transcript: session.turns.map((turn) => ({
        speaker: turn.speaker,
        kind: turn.kind,
        content: turn.content,
      })),
      report: session.report
        ? {
            readinessBand: session.report.readinessBand,
            readinessScore: session.report.readinessScore,
            details: session.report.reportJson,
          }
        : null,
    })),
  };
}
