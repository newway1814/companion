export type SetupResume = { analyzed: boolean } | null;
export type SetupRole = { analyzed: boolean } | null;

export type SetupReadiness = { ready: boolean; blockers: string[] };

/**
 * The extraction-review gate. A practice session must not start until a resume
 * and a target role are both selected and analyzed, and the user has confirmed
 * the extracted claims/requirements look right (PRD §5 hard stop).
 */
export function evaluateSetupReadiness(input: {
  resume: SetupResume;
  role: SetupRole;
  reviewed: boolean;
}): SetupReadiness {
  const blockers: string[] = [];

  if (!input.resume) {
    blockers.push("Add and select a resume.");
  } else if (!input.resume.analyzed) {
    blockers.push("Analyze your resume's claims first.");
  }

  if (!input.role) {
    blockers.push("Add and select a target role.");
  } else if (!input.role.analyzed) {
    blockers.push("Analyze your target role first.");
  }

  const bothAnalyzed =
    input.resume?.analyzed === true && input.role?.analyzed === true;
  if (bothAnalyzed && !input.reviewed) {
    blockers.push("Confirm the extracted claims and requirements look right.");
  }

  return { ready: blockers.length === 0, blockers };
}
