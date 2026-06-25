export type AiOutcome = "ok" | "invalid_output" | "refusal" | "safety_violation";

export interface AiLogRecord {
  promptId: string;
  promptVersion: number;
  model: string;
  outcome: AiOutcome;
  attempts: number;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * Builds a privacy-safe log record for an AI call. By construction it carries
 * only metadata — never the raw resume/transcript text or the generated output.
 */
export function buildAiLogRecord(input: {
  promptId: string;
  promptVersion: number;
  model: string;
  outcome: AiOutcome;
  attempts: number;
  latencyMs?: number;
  usage?: { input_tokens?: number; output_tokens?: number };
}): AiLogRecord {
  return {
    promptId: input.promptId,
    promptVersion: input.promptVersion,
    model: input.model,
    outcome: input.outcome,
    attempts: input.attempts,
    latencyMs: input.latencyMs,
    inputTokens: input.usage?.input_tokens,
    outputTokens: input.usage?.output_tokens,
  };
}
