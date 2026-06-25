import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  AiRefusalError,
  AiSafetyError,
  AiValidationError,
  runStructuredPrompt,
  type AiParseResult,
} from "./gateway";

const schema = z.object({ summary: z.string() });
const prompt = { id: "test", version: 1, system: "Extract a summary.", user: "x" };

function parse(result: Partial<AiParseResult<{ summary: string }>>) {
  return vi.fn(
    async (): Promise<AiParseResult<{ summary: string }>> => ({
      parsedOutput: null,
      stopReason: "end_turn",
      model: "claude-opus-4-8",
      ...result,
    }),
  );
}

describe("runStructuredPrompt", () => {
  it("returns the parsed, schema-valid output", async () => {
    const parseFn = parse({ parsedOutput: { summary: "ok" } });

    const out = await runStructuredPrompt({ prompt, schema }, parseFn);

    expect(out).toEqual({ summary: "ok" });
  });

  it("prepends the safety system prompt to every call", async () => {
    const parseFn = parse({ parsedOutput: { summary: "ok" } });

    await runStructuredPrompt({ prompt, schema }, parseFn);

    expect(parseFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringMatching(/pressure the answer/i),
      }),
    );
  });

  it("retries once on unparseable output, then succeeds", async () => {
    const parseFn = vi
      .fn()
      .mockResolvedValueOnce({
        parsedOutput: null,
        stopReason: "end_turn",
        model: "m",
      })
      .mockResolvedValueOnce({
        parsedOutput: { summary: "ok" },
        stopReason: "end_turn",
        model: "m",
      });

    const out = await runStructuredPrompt({ prompt, schema }, parseFn);

    expect(out).toEqual({ summary: "ok" });
    expect(parseFn).toHaveBeenCalledTimes(2);
  });

  it("throws AiValidationError when output never validates", async () => {
    const parseFn = parse({ parsedOutput: null });

    await expect(runStructuredPrompt({ prompt, schema }, parseFn)).rejects.toBeInstanceOf(
      AiValidationError,
    );
  });

  it("throws AiSafetyError when output trips a safety rule", async () => {
    const parseFn = parse({
      parsedOutput: { summary: "You are employable and will get the job." },
    });

    await expect(runStructuredPrompt({ prompt, schema }, parseFn)).rejects.toBeInstanceOf(
      AiSafetyError,
    );
  });

  it("throws AiRefusalError when the model refuses", async () => {
    const parseFn = parse({ stopReason: "refusal" });

    await expect(runStructuredPrompt({ prompt, schema }, parseFn)).rejects.toBeInstanceOf(
      AiRefusalError,
    );
  });
});
