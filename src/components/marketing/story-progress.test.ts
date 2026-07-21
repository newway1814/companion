import { describe, expect, it } from "vitest";

import { storyBeatAt } from "./story-progress";

describe("storyBeatAt", () => {
  it("maps normalized scroll progress to the five narrative beats", () => {
    expect(storyBeatAt(0)).toBe("resume-enters");
    expect(storyBeatAt(0.2)).toBe("claim-scanned");
    expect(storyBeatAt(0.4)).toBe("question-asked");
    expect(storyBeatAt(0.6)).toBe("gaps-flagged");
    expect(storyBeatAt(0.8)).toBe("answer-resolves");
  });

  it("clamps progress outside the normalized range", () => {
    expect(storyBeatAt(-0.5)).toBe("resume-enters");
    expect(storyBeatAt(1.5)).toBe("answer-resolves");
  });
});
