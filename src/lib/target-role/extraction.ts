import { z } from "zod";

import { runStructuredPrompt, type AiParseFn } from "@/lib/ai/gateway";
import { definePrompt } from "@/lib/ai/prompts";

const RequirementSchema = z.object({
  text: z.string(),
  importance: z.enum(["required", "preferred"]),
});

const CompanionNoteSchema = z.object({
  /** A note connecting a role requirement to the user's resume gaps. */
  note: z.string(),
  /** The resume claim/area this note relates to; "" if general. */
  relatedResumeClaim: z.string(),
});

export const RoleRequirementsSchema = z.object({
  requirements: z.array(RequirementSchema),
  impliedNeeds: z.array(z.string()),
  companionNotes: z.array(CompanionNoteSchema),
  /** STAR-story / preparation prompts where the role exposes a gap. */
  starPrompts: z.array(z.string()),
});

export type RoleRequirements = z.infer<typeof RoleRequirementsSchema>;
export type RoleRequirement = z.infer<typeof RequirementSchema>;

const NO_RESUME = "No resume on file.";

const buildRolePrompt = definePrompt<{ roleText: string; resumeContext: string }>(
  {
    id: "role-requirement-extraction",
    version: 1,
    system: `You are the JobDescriptionAnalyzerAgent. Analyse the target role text and produce:
- requirements: required and preferred skills/competencies named or clearly implied, each tagged "required" or "preferred".
- impliedNeeds: needs the role implies but doesn't state outright (e.g. on-call readiness, cross-team communication).
- companionNotes: notes that connect a requirement to the user's resume gaps. Use the provided resume context. Each note names the related resume claim/area in relatedResumeClaim ("" if general). If there is no resume, give general preparation notes.
- starPrompts: concrete preparation prompts (e.g. "Draft a STAR story about …") for the gaps the role exposes.

Analyse fit only. NEVER predict whether the user will or will not get hired, and never make a hiring recommendation. Only use facts present in the role text and resume context. Return JSON.`,
    buildUser: ({ roleText, resumeContext }) =>
      `Resume context:\n${resumeContext}\n\nTarget role:\n${roleText}`,
  },
);

/** Runs the JobDescriptionAnalyzerAgent over a role, using resume context for fit notes. */
export function extractRoleRequirements(
  roleText: string,
  resumeContext: string | null,
  parseFn?: AiParseFn,
): Promise<RoleRequirements> {
  return runStructuredPrompt(
    {
      prompt: buildRolePrompt({
        roleText,
        resumeContext: resumeContext?.trim() || NO_RESUME,
      }),
      schema: RoleRequirementsSchema,
    },
    parseFn,
  );
}
