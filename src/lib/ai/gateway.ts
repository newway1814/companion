import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { buildAiLogRecord, type AiOutcome } from "./logging";
import { SAFETY_SYSTEM_PROMPT, findSafetyViolations } from "./safety";

/** Default model. Override per call, or globally via GEMINI_MODEL. */
export const DEFAULT_AI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
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

let client: GoogleGenAI | undefined;

// Finish reasons that mean the model declined rather than answered.
const REFUSAL_FINISH_REASONS = new Set([
  "SAFETY",
  "PROHIBITED_CONTENT",
  "BLOCKLIST",
  "SPII",
  "IMAGE_SAFETY",
]);

const defaultParseFn: AiParseFn = async ({
  model,
  system,
  user,
  schema,
  maxTokens,
}) => {
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await client.models.generateContent({
    model,
    contents: user,
    config: {
      systemInstruction: system,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
    },
  });

  const finishReason = response.candidates?.[0]?.finishReason;
  const refused =
    response.promptFeedback?.blockReason != null ||
    (finishReason != null && REFUSAL_FINISH_REASONS.has(String(finishReason)));

  let parsedOutput: unknown = null;
  if (!refused && response.text) {
    try {
      const result = schema.safeParse(JSON.parse(response.text));
      if (result.success) parsedOutput = result.data;
    } catch {
      // Non-JSON output → leave null so the gateway retries.
    }
  }

  return {
    parsedOutput,
    stopReason: refused ? "refusal" : finishReason ? String(finishReason) : null,
    model,
    usage: {
      input_tokens: response.usageMetadata?.promptTokenCount,
      output_tokens: response.usageMetadata?.candidatesTokenCount,
    },
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
