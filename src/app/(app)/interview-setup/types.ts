/** Result of the start-interview action: the created session id, or an error. */
export type StartInterviewState =
  | { sessionId: string }
  | { error: string }
  | null;

export type StartInterviewAction = (
  state: StartInterviewState,
  formData: FormData,
) => Promise<StartInterviewState>;

/** Serializable confirmation context shown on the interview setup screen. */
export type InterviewSetupView = {
  resume: { filename: string; projectCount: number };
  role: { title: string; requirementCount: number };
};
