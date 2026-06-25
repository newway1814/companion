"use server";

import { AiSafetyError } from "@/lib/ai/gateway";
import { getUser } from "@/lib/auth";
import { buildResumeContext, buildRoleContext } from "@/lib/interview/context";
import { generateInterviewPlan } from "@/lib/interview/planner";
import { createInterviewSession } from "@/lib/interview/repository";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";
import { RoleRequirementsSchema } from "@/lib/target-role/extraction";
import { listTargetRoles } from "@/lib/target-role/repository";

import type { StartInterviewState } from "./types";

/**
 * Generates the five-question deep-dive plan from the user's active resume +
 * target role, persists the session and its ordered questions, and returns the
 * new session id so the client can open the interview room. The extraction must
 * already be confirmed (the /setup gate) — this re-derives context server-side
 * rather than trusting the client.
 */
export async function startInterviewAction(): Promise<StartInterviewState> {
  const user = await getUser();
  if (!user) return { error: "You need to be signed in." };

  const [resumes, roles] = await Promise.all([
    listResumes(user.id),
    listTargetRoles(user.id),
  ]);
  const activeResume = resumes.find((r) => r.isActive) ?? resumes[0] ?? null;
  const activeRole = roles.find((r) => r.isActive) ?? roles[0] ?? null;

  const profile = activeResume
    ? ResumeProfileSchema.safeParse(activeResume.parsedProfile)
    : null;
  const requirements = activeRole
    ? RoleRequirementsSchema.safeParse(activeRole.parsedRequirements)
    : null;

  if (!activeResume || !activeRole || !profile?.success || !requirements?.success) {
    return {
      error: "Add and analyze a resume and a target role before starting.",
    };
  }

  try {
    const plan = await generateInterviewPlan({
      resumeContext: buildResumeContext(profile.data),
      roleContext: buildRoleContext(activeRole.title, requirements.data),
    });
    const session = await createInterviewSession({
      userId: user.id,
      resumeId: activeResume.id,
      targetRoleId: activeRole.id,
      plan,
    });
    return { sessionId: session.id };
  } catch (error) {
    if (error instanceof AiSafetyError) {
      return {
        error:
          "The session plan was blocked by a safety check. Adjust your inputs and try again.",
      };
    }
    return { error: "Could not build your session. Please try again." };
  }
}
