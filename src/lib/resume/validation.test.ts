import { describe, expect, it } from "vitest";

import { MAX_RESUME_BYTES, validateResumeUpload } from "./validation";

describe("validateResumeUpload", () => {
  it("accepts a reasonable PDF", () => {
    expect(validateResumeUpload({ type: "application/pdf", size: 1024 })).toEqual(
      { ok: true },
    );
  });

  it("rejects a non-PDF file with a clear message", () => {
    const result = validateResumeUpload({ type: "image/png", size: 1024 });
    expect(result.ok).toBe(false);
    expect(result).toHaveProperty("error", expect.stringMatching(/pdf/i));
  });

  it("rejects a file over the size limit", () => {
    const result = validateResumeUpload({
      type: "application/pdf",
      size: MAX_RESUME_BYTES + 1,
    });
    expect(result.ok).toBe(false);
    expect(result).toHaveProperty("error", expect.stringMatching(/large|size/i));
  });

  it("rejects an empty file", () => {
    const result = validateResumeUpload({ type: "application/pdf", size: 0 });
    expect(result.ok).toBe(false);
  });
});
