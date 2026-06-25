import type { ResumeProfile } from "@/lib/resume/extraction";
import type { RoleRequirements } from "@/lib/target-role/extraction";

/**
 * Flattens an extracted resume profile into compact grounding text for the
 * InterviewPlannerAgent: skills plus each project claim with its status, any
 * verbatim metrics, and the gaps worth probing.
 */
export function buildResumeContext(profile: ResumeProfile): string {
  const claimLines = profile.claims.map((claim) => {
    const parts: string[] = [claim.status];
    if (claim.metrics.length) parts.push(`metrics: ${claim.metrics.join(", ")}`);
    if (claim.weakSpots.length) parts.push(`gaps: ${claim.weakSpots.join("/")}`);
    return `- ${claim.title} [${parts.join("; ")}]`;
  });

  return [
    `Summary: ${profile.summary}`,
    `Skills: ${profile.skills.join(", ")}`,
    "Project claims:",
    ...claimLines,
  ].join("\n");
}

/**
 * Flattens an extracted target role into compact grounding text: the title,
 * each requirement tagged required/preferred, and the implied needs.
 */
export function buildRoleContext(
  title: string,
  requirements: RoleRequirements,
): string {
  const requirementLines = requirements.requirements.map(
    (requirement) => `- ${requirement.text} (${requirement.importance})`,
  );

  const lines = [`Role: ${title}`, "Requirements:", ...requirementLines];
  if (requirements.impliedNeeds.length) {
    lines.push(`Implied needs: ${requirements.impliedNeeds.join(", ")}`);
  }
  return lines.join("\n");
}
