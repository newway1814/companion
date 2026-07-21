import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EvidenceSceneBoundary } from "@/components/marketing/evidence-scene-boundary";
import { getUser } from "@/lib/auth";

import { MarketingLanding } from "./landing-page";

export const metadata: Metadata = {
  title: "Companion | Defend the work behind your resume",
  description:
    "Practice software interviews with adaptive follow-up questions grounded in your resume and target role.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Companion | Interview practice that pushes back",
    description:
      "Turn resume claims into evidence-seeking interview practice and actionable coaching.",
    type: "website",
    images: [
      {
        url: "/marketing/evidence-chamber.png",
        width: 1536,
        height: 1024,
        alt: "A fictional resume inside Companion's evidence chamber",
      },
    ],
  },
};

export default async function HomePage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return <MarketingLanding scene={<EvidenceSceneBoundary />} />;
}
