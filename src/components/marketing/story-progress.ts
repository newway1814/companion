export const storyBeatIds = [
  "resume-enters",
  "claim-scanned",
  "question-asked",
  "gaps-flagged",
  "answer-resolves",
] as const;

export type StoryBeatId = (typeof storyBeatIds)[number];

export function storyBeatAt(progress: number): StoryBeatId {
  const normalized = Math.min(1, Math.max(0, progress));
  const index = Math.min(
    storyBeatIds.length - 1,
    Math.floor(normalized * storyBeatIds.length),
  );

  return storyBeatIds[index];
}
