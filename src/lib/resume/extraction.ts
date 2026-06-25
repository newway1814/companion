import { z } from "zod";

import { runStructuredPrompt, type AiParseFn } from "@/lib/ai/gateway";
import { definePrompt } from "@/lib/ai/prompts";

export const WEAK_SPOTS = [
  "missing-baseline",
  "vague-impact",
  "unclear-ownership",
  "missing-evidence",
] as const;

const ClaimSchema = z.object({
  title: z.string(),
  technologies: z.array(z.string()),
  /** Concrete metrics already present in the resume text (verbatim, not invented). */
  metrics: z.array(z.string()),
  status: z.enum(["verified", "hypothesis"]),
  weakSpots: z.array(z.enum(WEAK_SPOTS)),
  /** Plain-language note about the gap; "" when there is none. */
  warning: z.string(),
  /** A revision that improves structure WITHOUT inventing facts; "" when none. */
  suggestedRevision: z.string(),
});

export const ResumeProfileSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  claims: z.array(ClaimSchema),
});

export type ResumeProfile = z.infer<typeof ResumeProfileSchema>;
export type ResumeClaim = z.infer<typeof ClaimSchema>;

const buildExtractionPrompt = definePrompt<{ rawText: string }>({
  id: "resume-extraction",
  version: 1,
  system: `You are the ResumeProfilerAgent. Extract a structured profile from the resume text.

For each project or accomplishment ("claim"):
- title: a short name for the project/claim.
- technologies: tools/languages named in the text.
- metrics: concrete, measurable results that ALREADY appear in the text, quoted closely. Do NOT invent numbers.
- status: "verified" only if the claim has a concrete, measured result with enough context to defend it; otherwise "hypothesis".
- weakSpots: any of missing-baseline (a result with no starting point), vague-impact (impressive wording, no measurement), unclear-ownership ("we" with no personal role), missing-evidence (no supporting detail).
- warning: one plain sentence naming the gap, or "" if none.
- suggestedRevision: a rewrite that adds structure or asks for the missing evidence. NEVER invent metrics, results, or experience — if a number is missing, prompt for it with a placeholder like "[baseline]". Use "" if no revision is needed.

Only use facts present in the resume. Return JSON.`,
  buildUser: ({ rawText }) => `Resume text:\n\n${rawText}`,
});

/** Runs the ResumeProfilerAgent over resume text and returns a validated profile. */
export function extractResumeProfile(
  rawText: string,
  parseFn?: AiParseFn,
): Promise<ResumeProfile> {
  return runStructuredPrompt(
    { prompt: buildExtractionPrompt({ rawText }), schema: ResumeProfileSchema },
    parseFn,
  );
}
