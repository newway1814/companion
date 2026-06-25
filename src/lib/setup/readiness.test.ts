import { describe, expect, it } from "vitest";

import { evaluateSetupReadiness } from "./readiness";

describe("evaluateSetupReadiness", () => {
  it("blocks when there is no resume or role", () => {
    const result = evaluateSetupReadiness({
      resume: null,
      role: null,
      reviewed: false,
    });
    expect(result.ready).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/resume/i),
        expect.stringMatching(/role/i),
      ]),
    );
  });

  it("blocks when inputs exist but are not analyzed", () => {
    const result = evaluateSetupReadiness({
      resume: { analyzed: false },
      role: { analyzed: true },
      reviewed: false,
    });
    expect(result.ready).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining([expect.stringMatching(/analyze your resume/i)]),
    );
  });

  it("blocks until the extraction is reviewed", () => {
    const result = evaluateSetupReadiness({
      resume: { analyzed: true },
      role: { analyzed: true },
      reviewed: false,
    });
    expect(result.ready).toBe(false);
    expect(result.blockers).toEqual([
      expect.stringMatching(/confirm the extracted/i),
    ]);
  });

  it("is ready once both are analyzed and reviewed", () => {
    const result = evaluateSetupReadiness({
      resume: { analyzed: true },
      role: { analyzed: true },
      reviewed: true,
    });
    expect(result).toEqual({ ready: true, blockers: [] });
  });
});
