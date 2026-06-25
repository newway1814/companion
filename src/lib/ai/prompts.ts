import type { PromptSpec } from "./gateway";

/**
 * Defines a versioned prompt: a stable id + version + system prompt, plus a
 * builder for the user message. Bump `version` whenever the prompt changes so
 * logs stay traceable.
 */
export function definePrompt<TInput>(config: {
  id: string;
  version: number;
  system: string;
  buildUser: (input: TInput) => string;
}): (input: TInput) => PromptSpec {
  return (input) => ({
    id: config.id,
    version: config.version,
    system: config.system,
    user: config.buildUser(input),
  });
}
