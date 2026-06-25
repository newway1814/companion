import { describe, expect, it } from "vitest";

import { buildAiLogRecord } from "./logging";

describe("buildAiLogRecord", () => {
  it("records debug metadata and token usage", () => {
    const record = buildAiLogRecord({
      promptId: "resume-extraction",
      promptVersion: 1,
      model: "claude-opus-4-8",
      outcome: "ok",
      attempts: 1,
      latencyMs: 1234,
      usage: { input_tokens: 800, output_tokens: 120 },
    });

    expect(record).toMatchObject({
      promptId: "resume-extraction",
      promptVersion: 1,
      model: "claude-opus-4-8",
      outcome: "ok",
      attempts: 1,
      latencyMs: 1234,
      inputTokens: 800,
      outputTokens: 120,
    });
  });

  it("never carries raw prompt or output content (metadata only)", () => {
    const record = buildAiLogRecord({
      promptId: "p",
      promptVersion: 1,
      model: "claude-opus-4-8",
      outcome: "ok",
      attempts: 1,
    });

    // The only string-valued fields are non-sensitive identifiers.
    expect(Object.keys(record).sort()).toEqual(
      [
        "attempts",
        "inputTokens",
        "latencyMs",
        "model",
        "outcome",
        "outputTokens",
        "promptId",
        "promptVersion",
      ].sort(),
    );
  });
});
