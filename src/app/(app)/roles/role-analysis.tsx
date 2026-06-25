"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RoleRequirements } from "@/lib/target-role/extraction";
import { cn } from "@/lib/utils";

import type { AnalyzeRoleAction } from "./types";

export function RoleAnalysis({
  roleId,
  requirements,
  action,
}: {
  roleId: string;
  requirements: RoleRequirements | null;
  action: AnalyzeRoleAction;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  if (!requirements) {
    return (
      <div className="mt-6">
        <p className="text-body-md text-on-surface-variant">
          No role analysis yet. Run the analyzer to extract requirements and
          connect them to your resume.
        </p>
        <form action={formAction} className="mt-3">
          <input type="hidden" name="id" value={roleId} />
          <Button type="submit" disabled={pending}>
            {pending ? "Analyzing…" : "Analyze role"}
          </Button>
        </form>
        {state?.error ? (
          <p role="alert" className="mt-2 text-body-md text-on-error-container">
            {state.error}
          </p>
        ) : null}
        <p role="status" className="sr-only">
          {pending ? "Analyzing the role…" : ""}
        </p>
      </div>
    );
  }

  return (
    <section className="mt-6 space-y-5" aria-label="Role requirement analysis">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
          Requirements
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {requirements.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-2">
              <span
                className={cn(
                  "shrink-0 text-label-caps uppercase tracking-wide",
                  requirement.importance === "required"
                    ? "text-on-secondary-container"
                    : "text-on-surface-variant",
                )}
              >
                {requirement.importance}
              </span>
              <span className="text-body-md text-on-surface">
                {requirement.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {requirements.impliedNeeds.length > 0 ? (
        <div>
          <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
            Implied needs
          </p>
          <ul className="mt-2 list-disc pl-5 text-body-md text-on-surface">
            {requirements.impliedNeeds.map((need, index) => (
              <li key={index}>{need}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {requirements.companionNotes.length > 0 ? (
        <div>
          <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
            Companion notes
          </p>
          <ul className="mt-2 space-y-2">
            {requirements.companionNotes.map((note, index) => (
              <li key={index}>
                <Card>
                  <p className="text-body-md text-on-surface">{note.note}</p>
                  {note.relatedResumeClaim ? (
                    <p className="mt-1 text-mono-label text-on-surface-variant">
                      Related: {note.relatedResumeClaim}
                    </p>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {requirements.starPrompts.length > 0 ? (
        <div>
          <p className="text-label-caps uppercase tracking-wide text-on-surface-variant">
            Preparation prompts
          </p>
          <ul className="mt-2 list-disc pl-5 text-body-md text-on-surface">
            {requirements.starPrompts.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
