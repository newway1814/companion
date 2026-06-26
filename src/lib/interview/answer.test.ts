import { describe, expect, it } from "vitest";

import { validateAnswer } from "./answer";

describe("validateAnswer", () => {
  it("accepts a non-empty transcript and clamps duration to a non-negative integer", () => {
    const result = validateAnswer({ transcript: "  I owned the pipeline.  ", durationSeconds: 42.7 });

    expect(result).toEqual({
      ok: true,
      transcript: "I owned the pipeline.",
      durationSeconds: 42,
    });
  });

  it("rejects an empty or whitespace-only transcript", () => {
    expect(validateAnswer({ transcript: "   ", durationSeconds: 5 })).toMatchObject({
      ok: false,
    });
  });

  it("treats a negative or non-finite duration as zero", () => {
    expect(validateAnswer({ transcript: "ok", durationSeconds: -3 })).toMatchObject({
      ok: true,
      durationSeconds: 0,
    });
    expect(validateAnswer({ transcript: "ok", durationSeconds: NaN })).toMatchObject({
      ok: true,
      durationSeconds: 0,
    });
  });
});
