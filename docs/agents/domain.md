# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repo root, if it exists.
- `docs/adr/`, especially ADRs that touch the area about to be changed.

If these files do not exist yet, proceed silently. The `/domain-modeling` skill can create or sharpen them when terms or decisions are resolved.

## File structure

This is a single-context repo:

```text
/
+-- CONTEXT.md
+-- docs/adr/
+-- src/
```

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in `CONTEXT.md`. If the concept is missing, note it as a candidate for `/domain-modeling`.

## Product implementation guidance

For MVP planning and implementation, treat the live interview as a speech-first interview room with interviewer presence: the user answers by speaking, the app transcribes the answer, and the transcript drives follow-ups and evaluation. Do not make animated avatars or fully realtime two-way voice conversation a day-one dependency unless an explicit later decision changes the MVP scope.

Design the MVP as desktop-first. Mobile should remain usable for report review and short practice, but desktop is the primary design target for setup, longer answers, and the visual report.

The interface should feel like a focused interview workspace: calm, polished, slightly high-pressure, and organized around an interviewer panel, evidence panel, transcript timeline, and coaching-intelligence report. Avoid playful study-app styling and generic SaaS dashboard composition.

The MVP report should prioritize overall readiness, claim-defense issues, missing metrics, strongest answer, weakest answer, transcript highlights, improved answer rewrites, and the next practice drill. Avoid chart overload in the first version.

Treat sign-in, private-by-default data, deletion controls for resumes and sessions, no public sharing by default, no training on user data, and minimal logging of raw resumes/transcripts as MVP privacy requirements.

Do not include payments or subscriptions in the current MVP scope. Optimize first for useful practice sessions, report value, and repeat use.

Use these MVP success signals when evaluating product decisions: first-session completion, report viewed, at least one improved answer read, practice drill started, and repeat session within 7 days.

When resume or target-role extraction is uncertain, show an extraction review where the user can confirm or edit extracted claims and requirements before starting. Do not silently build a practice session from uncertain extraction.

The interviewer may be direct and skeptical, but must pressure the answer rather than the person. It should ask evidence-seeking questions and must not diagnose personality, insult the user, infer protected traits, or claim the user is employable or unemployable.

For the flagship technical project deep-dive, design the MVP around a five-question session that takes roughly 10-12 minutes. Allow one or two adaptive follow-ups per question so sessions do not spiral.

Empty setup state should invite uploading a resume and pasting a target role, with a sample JD option. Setup loading should feel like Companion is building an interview plan, using progress language such as "Extracting project claims," "Matching to role requirements," and "Preparing follow-up strategy." Setup success should show the test preview.

The dashboard should make "Start practice" the dominant action. Saved history can appear below once it exists, but should not compete with starting the next practice session.

During live interviews, show a subtle evidence panel with the current probing focus and the resume or target-role snippet being tested. Do not expose full chain-of-thought or internal reasoning.

MVP non-goals: animated avatar, fully realtime two-way voice conversation, coding editor, video analysis, facial or body-language scoring, employer workflows, payments, career-center admin, social sharing, and multi-user mock interviews.

Primary product risks, in order: poor answer evaluation quality causing loss of trust, poor extraction quality causing bad interview plans, and failing to make the speech-first interview room feel like a real interview without overbuilding avatar or realtime voice infrastructure.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding the decision.
