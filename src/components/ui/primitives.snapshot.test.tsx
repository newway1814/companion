import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";
import { Card, Panel } from "./card";
import { ClaimCard } from "./claim-card";
import { EvidenceChip } from "./evidence-chip";
import { Input } from "./input";
import { StatusBadge } from "./status-badge";
import { TranscriptRow } from "./transcript-row";

/**
 * A gallery of every primitive in its key variants/states. The snapshot is the
 * AC's "visual check" of the academic_precision rendering — a diff here means a
 * primitive's markup or token classes changed and should be reviewed.
 */
function Gallery() {
  return (
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button disabled>Disabled</Button>

      <Input placeholder="Type here" />
      <Input disabled placeholder="Disabled" />

      <Card title="With title">Body</Card>
      <Card>No title</Card>
      <Panel>Panel</Panel>

      <EvidenceChip>Baseline</EvidenceChip>

      <ClaimCard title="Verified" variant="verified">
        Body
      </ClaimCard>
      <ClaimCard title="Hypothesis" variant="hypothesis">
        Body
      </ClaimCard>

      <StatusBadge status="verified" />
      <StatusBadge status="missing" />
      <StatusBadge status="incomplete" />
      <StatusBadge status="warning" />

      <TranscriptRow speaker="Interviewer" state="completed">
        Completed
      </TranscriptRow>
      <TranscriptRow speaker="Interviewer" state="active">
        Active
      </TranscriptRow>
      <TranscriptRow speaker="You" state="upcoming">
        Upcoming
      </TranscriptRow>
    </div>
  );
}

describe("primitives gallery", () => {
  it("matches the academic_precision visual snapshot", () => {
    const { container } = render(<Gallery />);

    expect(container).toMatchSnapshot();
  });
});
