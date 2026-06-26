export type AnswerValidation =
  | { ok: true; transcript: string; durationSeconds: number }
  | { ok: false; error: string };

/**
 * Validates a submitted answer before it is recorded. The transcript must have
 * content (spoken or typed); duration is normalised to a non-negative whole
 * number of seconds.
 */
export function validateAnswer(input: {
  transcript: string;
  durationSeconds: number;
}): AnswerValidation {
  const transcript = input.transcript.trim();
  if (!transcript) {
    return { ok: false, error: "Add an answer before submitting." };
  }

  const durationSeconds = Number.isFinite(input.durationSeconds)
    ? Math.max(0, Math.floor(input.durationSeconds))
    : 0;

  return { ok: true, transcript, durationSeconds };
}
