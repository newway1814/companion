import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";

import { buildAiLogRecord, type AiOutcome } from "./logging";
import { SAFETY_SYSTEM_PROMPT, findSafetyViolations } from "./safety";

/** Default model. Override per call, or globally via ANTHROPIC_MODEL. */
export const DEFAULT_AI_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";
const MAX_ATTEMPTS = 2;
const DEFAULT_MAX_TOKENS = 8192;

export interface PromptSpec {
  id: string;
  version: number;
  system: string;
  user: string;
}

export interface AiParseResult<T> {
  parsedOutput: T | null;
  stopReason: string | null;
  model: string;
  usage?: { input_tokens?: number; output_tokens?: number };
}

export type AiParseFn = (args: {
  model: string;
  system: string;
  user: string;
  schema: z.ZodType<unknown>;
  maxTokens: number;
}) => Promise<AiParseResult<unknown>>;

export class AiValidationError extends Error {}
export class AiRefusalError extends Error {}
export class AiSafetyError extends Error {
  constructor(public readonly violations: string[]) {
    super(`AI output failed safety checks: ${violations.join(", ")}`);
    this.name = "AiSafetyError";
  }
}

let client: Anthropic | undefined;

const defaultParseFn: AiParseFn = async ({
  model,
  system,
  user,
  schema,
  maxTokens,
}) => {
  client ??= new Anthropic();
  const response = await client.messages.parse({
    model,
    max_tokens: maxTokens,
    thinking: { type: "adaptive" },
    system,
    messages: [{ role: "user", content: user }],
    output_config: { format: zodOutputFormat(schema) },
  });
  return {
    parsedOutput: response.parsed_output ?? null,
    stopReason: response.stop_reason,
    model: response.model,
    usage: response.usage,
  };
};

function log(record: ReturnType<typeof buildAiLogRecord>) {
  if (process.env.NODE_ENV !== "test") {
    console.debug("[ai]", record);
  }
}

/**
 * The single entry point for every Companion agent call. Prepends the safety
 * system prompt, validates the output against `schema` (retrying on parse
 * failure), scans the result for safety violations, and logs privacy-safe
 * metadata. Returns typed, schema-valid output or throws a typed error.
 */
export async function runStructuredPrompt<T>(
  options: {
    prompt: PromptSpec;
    schema: z.ZodType<T>;
    model?: string;
    maxTokens?: number;
  },
  parseFn: AiParseFn = defaultParseFn,
): Promise<T> {
  const model = options.model ?? DEFAULT_AI_MODEL;
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  const system = `${SAFETY_SYSTEM_PROMPT}\n\n${options.prompt.system}`;
  const startedAt = Date.now();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = (await parseFn({
      model,
      system,
      user: options.prompt.user,
      schema: options.schema,
      maxTokens,
    })) as AiParseResult<T>;

    const emit = (outcome: AiOutcome) =>
      log(
        buildAiLogRecord({
          promptId: options.prompt.id,
          promptVersion: options.prompt.version,
          model: result.model,
          outcome,
          attempts: attempt,
          latencyMs: Date.now() - startedAt,
          usage: result.usage,
        }),
      );

    if (result.stopReason === "refusal") {
      emit("refusal");
      throw new AiRefusalError("The model declined to respond.");
    }
    if (result.parsedOutput == null) {
      emit("invalid_output");
      continue;
    }

    const violations = findSafetyViolations(JSON.stringify(result.parsedOutput));
    if (violations.length > 0) {
      emit("safety_violation");
      throw new AiSafetyError(violations);
    }

    emit("ok");
    return result.parsedOutput;
  }

  throw new AiValidationError(
    `Model output did not match the schema after ${MAX_ATTEMPTS} attempts.`,
  );
}
