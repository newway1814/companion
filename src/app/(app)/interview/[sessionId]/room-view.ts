import type {
  InterviewSessionStatus,
  InterviewTurnKind,
  InterviewTurnSpeaker,
} from "@/generated/prisma/enums";

export type RoomQuestionState = "done" | "active" | "upcoming";

export type TranscriptTurn = {
  /** Display name for the turn's author ("Interviewer" or "You"). */
  speaker: string;
  kind: InterviewTurnKind;
  content: string;
};

export type TranscriptItem = {
  orderIndex: number;
  questionId: string;
  label: string;
  state: RoomQuestionState;
  turns: TranscriptTurn[];
};

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
  timeline: TranscriptItem[];
};

type QuestionInput = { id: string; orderIndex: number; questionText: string };
type TurnInput = {
  questionId: string;
  speaker: InterviewTurnSpeaker;
  kind: InterviewTurnKind;
  content: string;
  orderIndex: number;
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  "technical-project-deep-dive": "Project Deep-Dive",
};

const STATUS_LABELS: Record<InterviewSessionStatus, string> = {
  PLANNED: "Ready",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const SPEAKER_LABELS: Record<InterviewTurnSpeaker, string> = {
  INTERVIEWER: "Interviewer",
  CANDIDATE: "You",
};

/**
 * Maps a persisted session and its transcript turns into the room view model.
 * A question is "done" once the candidate has answered it; the first unanswered
 * question is "active" and the rest "upcoming". Turns are nested under their
 * question in order, so the timeline reflects real session state — never a
 * static list.
 */
export function buildRoomView(session: {
  status: InterviewSessionStatus;
  mode: string;
  questions: QuestionInput[];
  turns: TurnInput[];
}): InterviewRoomView {
  const questions = [...session.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const turns = [...session.turns].sort((a, b) => a.orderIndex - b.orderIndex);

  const answeredQuestionIds = new Set(
    turns
      .filter((turn) => turn.kind === "ANSWER" && turn.speaker === "CANDIDATE")
      .map((turn) => turn.questionId),
  );

  const firstUnanswered = questions.findIndex(
    (question) => !answeredQuestionIds.has(question.id),
  );
  // All answered → focus the last question (the session-complete bridge is its
  // own screen); otherwise focus the first unanswered question.
  const activeIndex = firstUnanswered === -1 ? null : firstUnanswered;
  const currentIndex =
    activeIndex ?? Math.max(0, questions.length - 1);

  const timeline: TranscriptItem[] = questions.map((question, index) => ({
    orderIndex: question.orderIndex,
    questionId: question.id,
    label: `Question ${index + 1}`,
    state: answeredQuestionIds.has(question.id)
      ? "done"
      : index === activeIndex
        ? "active"
        : "upcoming",
    turns: turns
      .filter((turn) => turn.questionId === question.id)
      .map((turn) => ({
        speaker: SPEAKER_LABELS[turn.speaker],
        kind: turn.kind,
        content: turn.content,
      })),
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
