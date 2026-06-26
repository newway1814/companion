import type { InterviewSessionStatus } from "@/generated/prisma/enums";

export type RoomQuestionState = "done" | "active" | "upcoming";

export type InterviewRoomView = {
  /** Human label for the session mode (e.g. "Project Deep-Dive"). */
  sessionType: string;
  /** Lifecycle label shown in the header (Ready / In progress / Completed). */
  statusLabel: string;
  /** 0-based index of the question the room is focused on. */
  currentIndex: number;
  totalQuestions: number;
  /** Estimated session length for the five-question rhythm. */
  timingLabel: string;
  /** The interviewer's role framing (MVP: a senior engineer). */
  interviewerRole: string;
  currentQuestion: { orderIndex: number; text: string } | null;
  timeline: { orderIndex: number; title: string; state: RoomQuestionState }[];
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  "technical-project-deep-dive": "Project Deep-Dive",
};

const STATUS_LABELS: Record<InterviewSessionStatus, string> = {
  PLANNED: "Ready",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

/**
 * Maps a persisted session into the room shell's view model. The "current"
 * question is the first one (no answers exist yet — the answer flow is a later
 * slice); the timeline marks it active and the rest upcoming.
 */
export function buildRoomView(session: {
  status: InterviewSessionStatus;
  mode: string;
  questions: { orderIndex: number; questionText: string }[];
}): InterviewRoomView {
  const questions = [...session.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const currentIndex = 0;

  const timeline = questions.map((question, index) => ({
    orderIndex: question.orderIndex,
    title: question.questionText,
    state:
      index < currentIndex
        ? ("done" as const)
        : index === currentIndex
          ? ("active" as const)
          : ("upcoming" as const),
  }));

  const current = questions[currentIndex];

  return {
    sessionType: SESSION_TYPE_LABELS[session.mode] ?? "Project Deep-Dive",
    statusLabel: STATUS_LABELS[session.status],
    currentIndex,
    totalQuestions: questions.length,
    timingLabel: "10–12 min",
    interviewerRole: "Senior Engineer",
    currentQuestion: current
      ? { orderIndex: current.orderIndex, text: current.questionText }
      : null,
    timeline,
  };
}
