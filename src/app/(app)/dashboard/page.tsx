import { LandingEntry, type DashboardData } from "@/components/dashboard/landing-entry";
import { getUser } from "@/lib/auth";
import { ResumeProfileSchema } from "@/lib/resume/extraction";
import { listResumes } from "@/lib/resume/repository";
import { listSessionsForUser } from "@/lib/interview/repository";
import { RoleRequirementsSchema } from "@/lib/target-role/extraction";
import { listTargetRoles } from "@/lib/target-role/repository";

const dateLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    return <LandingEntry />;
  }

  const [resumes, roles, sessions] = await Promise.all([
    listResumes(user.id),
    listTargetRoles(user.id),
    listSessionsForUser(user.id),
  ]);

  const activeResume = resumes.find((r) => r.isActive) ?? resumes[0] ?? null;
  const activeRole = roles.find((r) => r.isActive) ?? roles[0] ?? null;

  const resumeProfile = activeResume
    ? ResumeProfileSchema.safeParse(activeResume.parsedProfile)
    : null;
  const roleRequirements = activeRole
    ? RoleRequirementsSchema.safeParse(activeRole.parsedRequirements)
    : null;

  const claims = resumeProfile?.success ? resumeProfile.data.claims : [];

  const data: DashboardData = {
    resume: activeResume
      ? {
          id: activeResume.id,
          filename: activeResume.filename,
          analyzed: resumeProfile?.success ?? false,
          claimCount: claims.length,
          needsEvidenceCount: claims.filter((c) => c.status !== "verified").length,
          topClaims: claims
            .filter((c) => c.status !== "verified")
            .slice(0, 3)
            .map((c) => ({
              title: c.title,
              verified: c.status === "verified",
              weakSpots: c.weakSpots,
            })),
        }
      : null,
    role: activeRole
      ? {
          id: activeRole.id,
          title: activeRole.title,
          company: activeRole.company,
          analyzed: roleRequirements?.success ?? false,
          requirementCount: roleRequirements?.success
            ? roleRequirements.data.requirements.length
            : 0,
        }
      : null,
    sessions: sessions.slice(0, 4).map((session) => ({
      id: session.id,
      dateLabel: dateLabel(session.createdAt),
      resumeName: session.resume?.filename ?? "—",
      roleTitle: session.targetRole?.title ?? "—",
      statusLabel:
        session.status === "COMPLETED"
          ? "Complete"
          : session.status === "IN_PROGRESS"
            ? "In progress"
            : "Not started",
      readinessBand: session.report?.readinessBand ?? null,
      readinessScore: session.report?.readinessScore ?? null,
      href: session.report ? `/interview/${session.id}/report` : `/interview/${session.id}`,
    })),
    totalSessions: sessions.length,
  };

  return <LandingEntry data={data} />;
}
