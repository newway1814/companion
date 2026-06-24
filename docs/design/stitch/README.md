# Stitch MVP UI Handoff

This directory contains the Stitch-generated MVP UI design for Companion. Treat these pages as the visual and interaction source of truth for the MVP UI.

Production UI work must reference the relevant page folder before implementation. The previous Codex-generated prototype UI was rejected and must not be used as a production baseline.

Stitch is authoritative for UI composition and interaction direction. Product behavior and scope still come from `CONTEXT.md`, ADRs, and the PRD; if static mock copy conflicts with those docs, preserve the Stitch structure while following the documented MVP direction.

## Priority Screens

1. `pages/main_interview_room/` - the normal live practice session workspace.
2. `pages/live_challenge_moment/` - the moment Companion challenges a weak or unsupported answer.
3. `pages/final_coaching_report/` - the post-session coaching report.

These three screens define the core MVP experience: practice, adaptive pressure, and feedback.

## Page Index

| Page folder | Represents | Use when implementing |
| --- | --- | --- |
| `pages/academic_precision/` | The Stitch design system: color tokens, typography, spacing, panel treatment, component tone, and the "Modern Academic Rigor" visual direction. | Global theme, shared UI primitives, layout rules, and visual QA. |
| `pages/landing_entry/` | The signed-out or dashboard-entry gateway focused on defending software project claims. | Entry page, primary "Start project deep-dive" action, privacy reassurance, and preview of the challenge mechanic. |
| `pages/sign_in/` | Sign-in screen for returning users. | Authentication entry, university email/Google sign-in options, and privacy reassurance copy. |
| `pages/first_time_setup/` | Initial configuration flow for first-time setup. | Resume upload, resume parsed state, target role form, and handoff into interview setup. |
| `pages/interview_setup/` | Pre-session confirmation screen after inputs are selected. | Test preview, source resume, target role, five-question session framing, and start interview CTA. |
| `pages/main_interview_room/` | Default live interview room. | Core practice session layout: interviewer panel, transcript timeline, answer composer, target claim, required evidence, and interviewer notes. |
| `pages/live_challenge_moment/` | In-session challenge state when an answer lacks evidence. | Live challenge behavior, evidence highlighting, answer-improvement chips, and evidence room sidebar. |
| `pages/session_complete/` | Completion state after a practice session. | Transition from interview room to final report, including summary counts and "View coaching report" CTA. |
| `pages/final_coaching_report/` | Post-session coaching report. | Readiness score, technical depth assessment, claim-defense vulnerabilities, suggested reframing, and report navigation. |
| `pages/session_history/` | Saved practice session list. | Session table, filters/search, readiness score summaries, empty state, and report reopen actions. |
| `pages/resume_management/` | Resume library and claim analysis surface. | Saved resume list, active resume detail, extracted project claims, metrics, gaps, and suggested revisions. |
| `pages/target_role_management/` | Target role library and role-fit analysis surface. | Saved target roles, extracted requirements, Companion notes, resume/role gap analysis, and STAR-story prompts. |
| `pages/privacy_settings/` | Privacy and account settings. | Privacy guarantee, data controls, export, clear workspace data, and account deletion surfaces. |

## Source Artifacts

Most page folders contain:

- `screen.png` - the visual reference to match during implementation.
- `code.html` - the Stitch-generated HTML and utility-class structure to inspect for spacing, labels, layout, and component hierarchy.

`pages/academic_precision/` contains `DESIGN.md`, which defines the design system rather than a single app screen.

Known gaps/conflicts to handle during implementation:

- `pages/interview_setup/` includes static "Text-first" copy, but the MVP remains speech-first with typed fallback for accessibility or recovery.
- Some static sample copy references system design; the MVP remains a technical project deep-dive, not a first-class system design mode.
- `pages/privacy_settings/` includes a static Billing tab, but payments and subscriptions are MVP non-goals. Suppress Billing in MVP implementation unless a later ADR changes scope.
- Stitch does not include a separately named extraction-review page. Use the `first_time_setup` and `interview_setup` visual language for unresolved extraction review until a dedicated Stitch page exists.
