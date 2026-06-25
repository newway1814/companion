import { getUser } from "@/lib/auth";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";
import { RoleRequirementsSchema } from "@/lib/target-role/extraction";
import { listTargetRoles } from "@/lib/target-role/repository";

import { SetupFlow, type SetupResumeView, type SetupRoleView } from "./setup-flow";

export default async function SetupPage() {
  const user = await getUser();
  const [resumes, roles] = user
    ? await Promise.all([listResumes(user.id), listTargetRoles(user.id)])
    : [[], []];

  const activeResume = resumes.find((r) => r.isActive) ?? resumes[0] ?? null;
  const activeRole = roles.find((r) => r.isActive) ?? roles[0] ?? null;

  let resume: SetupResumeView = null;
  if (activeResume) {
    const parsed = ResumeProfileSchema.safeParse(activeResume.parsedProfile);
    resume = {
      id: activeResume.id,
      filename: activeResume.filename,
      claims: parsed.success
        ? parsed.data.claims.map((claim) => ({
            title: claim.title,
            weakSpots: claim.weakSpots,
          }))
        : null,
    };
  }

  let role: SetupRoleView = null;
  if (activeRole) {
    const parsed = RoleRequirementsSchema.safeParse(activeRole.parsedRequirements);
    role = {
      id: activeRole.id,
      title: activeRole.title,
      requirements: parsed.success
        ? parsed.data.requirements.map((requirement) => ({
            text: requirement.text,
            importance: requirement.importance,
          }))
        : null,
    };
  }

  return <SetupFlow resume={resume} role={role} />;
}
