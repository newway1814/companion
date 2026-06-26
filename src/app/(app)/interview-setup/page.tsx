import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";
import { RoleRequirementsSchema } from "@/lib/target-role/extraction";
import { listTargetRoles } from "@/lib/target-role/repository";

import { startInterviewAction } from "./actions";
import { InterviewSetup } from "./interview-setup";

export default async function InterviewSetupPage() {
  const user = await getUser();
  const [resumes, roles] = user
    ? await Promise.all([listResumes(user.id), listTargetRoles(user.id)])
    : [[], []];

  const activeResume = resumes.find((r) => r.isActive) ?? resumes[0] ?? null;
  const activeRole = roles.find((r) => r.isActive) ?? roles[0] ?? null;

  const profile = activeResume
    ? ResumeProfileSchema.safeParse(activeResume.parsedProfile)
    : null;
  const requirements = activeRole
    ? RoleRequirementsSchema.safeParse(activeRole.parsedRequirements)
    : null;

  // The extraction-review gate lives on /setup; never confirm a session whose
  // resume/role context isn't selected and analyzed.
  if (!activeResume || !activeRole || !profile?.success || !requirements?.success) {
    redirect("/setup");
  }

  const view = {
    resume: {
      filename: activeResume.filename,
      projectCount: profile.data.claims.length,
    },
    role: {
      title: activeRole.title,
      requirementCount: requirements.data.requirements.length,
    },
  };

  return <InterviewSetup view={view} startAction={startInterviewAction} />;
}
