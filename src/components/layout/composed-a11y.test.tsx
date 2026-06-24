import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { AppShell } from "./app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClaimCard } from "@/components/ui/claim-card";
import { EvidenceChip } from "@/components/ui/evidence-chip";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { TranscriptRow } from "@/components/ui/transcript-row";

function ComposedPage() {
  return (
    <AppShell>
      <div className="p-gutter">
        <h1 className="font-heading text-display-md">Workspace</h1>
        {/* Three-pane workspace layout hosted by the shell */}
        <div className="grid gap-px md:grid-cols-[1fr_320px]">
          <section aria-label="Work area" className="flex flex-col gap-4">
            <h2 className="font-heading text-section-title">Resume library</h2>
            <Card title="Saved resumes">
              <ClaimCard title="Reduced API latency" variant="verified">
                <StatusBadge status="verified" />
                <p>Cut p95 latency from 800ms to 120ms.</p>
              </ClaimCard>
              <form className="mt-4 flex flex-col gap-2">
                <label htmlFor="role">Target role</label>
                <Input id="role" placeholder="e.g. Backend intern" />
                <Button>Save</Button>
              </form>
            </Card>
          </section>
          <aside aria-label="Evidence" className="flex flex-col gap-2">
            <EvidenceChip>Baseline</EvidenceChip>
            <TranscriptRow speaker="Interviewer" state="active">
              Walk me through the project.
            </TranscriptRow>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

describe("composed page accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<ComposedPage />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
