import { describe, expect, it } from "vitest";

import { definePrompt } from "./prompts";

describe("definePrompt", () => {
  it("builds a versioned prompt spec from input", () => {
    const build = definePrompt<{ name: string }>({
      id: "greet",
      version: 2,
      system: "You greet people.",
      buildUser: (input) => `Greet ${input.name}.`,
    });

    expect(build({ name: "Ada" })).toEqual({
      id: "greet",
      version: 2,
      system: "You greet people.",
      user: "Greet Ada.",
    });
  });
});
