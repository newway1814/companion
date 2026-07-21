/**
 * MVP success-signal analytics (docs/agents/domain.md). Events carry only ids
 * and small metadata — never raw resumes, target-role text, transcripts, or
 * audio. The sink is swappable so a real product-analytics backend can replace
 * the default without touching call sites.
 */

export type AnalyticsEvent =
  | { name: "landing_viewed" }
  | { name: "landing_primary_cta_selected" }
  | { name: "landing_story_selected" }
  | { name: "sign_in_reached" }
  | { name: "first_session_completed"; userId: string; sessionId: string }
  | { name: "report_viewed"; userId: string; sessionId: string }
  | { name: "improved_answer_read"; userId: string; sessionId: string }
  | { name: "practice_drill_started"; userId: string; sessionId?: string }
  | {
      name: "repeat_session_within_7_days";
      userId: string;
      sessionId: string;
      priorSessionId: string;
    };

export interface AnalyticsSink {
  record(event: AnalyticsEvent): void | Promise<void>;
}

/** Default sink: privacy-safe metadata log; replace via setAnalyticsSink. */
const defaultSink: AnalyticsSink = {
  record(event) {
    if (process.env.NODE_ENV !== "test") {
      console.debug("[analytics]", event);
    }
  },
};

let sink: AnalyticsSink = defaultSink;

export function setAnalyticsSink(next: AnalyticsSink): void {
  sink = next;
}

export function resetAnalyticsSink(): void {
  sink = defaultSink;
}

/** Records an event through the configured sink. */
export async function track(event: AnalyticsEvent): Promise<void> {
  await sink.record(event);
}

export async function emitLandingViewed(): Promise<void> {
  await track({ name: "landing_viewed" });
}

export async function emitLandingPrimaryCtaSelected(): Promise<void> {
  await track({ name: "landing_primary_cta_selected" });
}

export async function emitLandingStorySelected(): Promise<void> {
  await track({ name: "landing_story_selected" });
}

export async function emitSignInReached(): Promise<void> {
  await track({ name: "sign_in_reached" });
}

/** Fires only when this is the user's first completed session. */
export async function emitFirstSessionCompleted(input: {
  userId: string;
  sessionId: string;
  completedSessionCount: number;
}): Promise<void> {
  if (input.completedSessionCount === 1) {
    await track({
      name: "first_session_completed",
      userId: input.userId,
      sessionId: input.sessionId,
    });
  }
}

export async function emitReportViewed(input: {
  userId: string;
  sessionId: string;
}): Promise<void> {
  await track({ name: "report_viewed", ...input });
}

export async function emitImprovedAnswerRead(input: {
  userId: string;
  sessionId: string;
}): Promise<void> {
  await track({ name: "improved_answer_read", ...input });
}

export async function emitPracticeDrillStarted(input: {
  userId: string;
  sessionId?: string;
}): Promise<void> {
  await track({ name: "practice_drill_started", ...input });
}

/** Fires only when the user has a prior session within the last 7 days. */
export async function emitRepeatSession(input: {
  userId: string;
  sessionId: string;
  priorSessionId: string | null;
}): Promise<void> {
  if (input.priorSessionId) {
    await track({
      name: "repeat_session_within_7_days",
      userId: input.userId,
      sessionId: input.sessionId,
      priorSessionId: input.priorSessionId,
    });
  }
}
