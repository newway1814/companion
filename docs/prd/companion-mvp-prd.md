# Companion MVP PRD

> **Status: historical MVP spec.** The MVP has shipped. UI/UX authority now lives in the impeccable-managed `DESIGN.md` + `PRODUCT.md` at the repo root ([ADR 0004](../adr/0004-adopt-impeccable-design-md-as-ui-source-of-truth.md), superseding [ADR 0003](../adr/0003-adopt-in-repo-design-system.md)). The "Source of truth: …stitch…" references below are retained as the MVP's visual provenance, not as current authority.

## 1. Product Summary

Companion is a private, desktop-first AI interview sparring partner for university candidates preparing for software internship interviews. The MVP focuses on one flagship interview mode: a technical project deep-dive that helps the user defend resume project claims with ownership, implementation detail, tradeoffs, baselines, and measured results.

The MVP experience is a bounded five-question practice session. The user starts from a resume and target role, reviews what Companion extracted, enters an interview workspace, answers questions, receives adaptive follow-up pressure when answers are vague or unsupported, and ends with a performance report that turns the session into concrete coaching.

Stitch was the MVP UI source of truth and bootstrapped the shipped screens; UI authority has since moved to the in-repo design system (`docs/design/design-system.md`, [ADR 0003](../adr/0003-adopt-in-repo-design-system.md)). The production UI must not revive or borrow from the rejected earlier Codex-generated prototype UI.

## 2. Target User

The initial target user is a university candidate preparing for a software internship or early-career software engineering interview.

Primary traits:

- Has at least one resume project that may be difficult to defend under skeptical follow-up.
- Wants realistic practice before speaking with a real interviewer.
- Uses preparation alternatives such as friends, career centers, LeetCode, YouTube, ChatGPT roleplay, or generic interview platforms.
- Needs pressure on their actual resume and target role, not generic interview questions.
- Values privacy because resumes, transcripts, and reports contain sensitive career data.

Secondary users such as bootcamp students, new graduates, career centers, and non-software candidates are not the MVP target.

## 3. MVP Scope

The MVP includes:

- Sign-in for private saved history.
- Resume upload or resume entry.
- Target role entry and saved target role management.
- Extraction of resume claims, project claims, metrics, gaps, and target-role requirements.
- Extraction review when parsing is uncertain or before a session starts.
- A technical project deep-dive practice session with five primary questions and a maximum of one or two adaptive follow-ups per question.
- A speech-first interview room with interviewer presence, transcript timeline, answer entry, current target claim, required evidence, and interviewer notes.
- A live challenge moment that identifies vague claims, missing metrics, or unsupported assertions during the session.
- A final coaching report with readiness, technical depth, claim-defense vulnerabilities, suggested reframing, and next practice guidance.
- Saved resumes, saved target roles, saved practice sessions, reports, and deletion controls.
- Desktop-first implementation that remains usable on mobile for sign-in, report review, short practice, and basic management flows.

## 4. Non-Goals

The MVP will not include:

- Animated avatar.
- Fully realtime two-way voice conversation.
- Coding editor.
- Video analysis.
- Facial or body-language scoring.
- Employer workflows.
- Candidate ranking or hiring recommendations.
- Payments or subscriptions.
- Career-center admin.
- Social sharing or public reports by default.
- Multi-user mock interviews.
- Full HR, coding-round, system design, consulting, product, or sales modes as first-class experiences.
- Any UI direction based on the rejected Codex-generated prototype.

## 5. Core User Journey

1. The user signs in from `pages/sign_in/`.
2. The user reaches the entry/dashboard experience represented by `pages/landing_entry/`, where starting a project deep-dive is the dominant action.
3. The user uploads or selects a resume in `pages/first_time_setup/` or manages existing resumes through `pages/resume_management/`.
4. The user enters or selects a target role in `pages/first_time_setup/` or manages existing roles through `pages/target_role_management/`.
5. Companion extracts project claims, metrics, target-role requirements, and likely challenge areas.
6. If extraction is uncertain, the user must confirm or edit extracted claims and requirements before the session starts.
7. The user reviews session parameters in `pages/interview_setup/`: source profile, target position, detected projects/requirements, five-question session framing, and start interview CTA.
8. The user enters `pages/main_interview_room/` for the standard practice session.
9. Companion asks evidence-seeking questions grounded in the resume and target role.
10. The user answers by speaking where available, with text entry as an accessibility and recovery fallback.
11. Companion updates the transcript timeline and required evidence state.
12. When an answer is vague or unsupported, Companion enters the `pages/live_challenge_moment/` state and asks one sharper follow-up tied to a visible claim or requirement.
13. After the five-question session, the user sees `pages/session_complete/`.
14. The user opens `pages/final_coaching_report/` and reviews readiness, technical depth, vulnerabilities, and suggested reframing.
15. The user can return through `pages/session_history/`, reuse saved resumes or target roles, delete sensitive artifacts, or start another practice session.

Hard-stop behavior:

- A session with unresolved extraction uncertainty must not start.
- Follow-up pressure must stop at the per-question cap.
- The interviewer must pressure the answer, not the person.
- Companion must not claim the user is employable or unemployable.

## 6. Exact Screen List from Stitch

The exact MVP screen/page folders are:

| Stitch page folder | Product meaning | Implementation obligation |
| --- | --- | --- |
| `pages/academic_precision/` | Design system and visual direction. | Implement shared tokens, typography, spacing, surfaces, borders, radius, and component tone from this reference. |
| `pages/landing_entry/` | Product entry/dashboard gateway. | Preserve claim-defense positioning, start project deep-dive CTA, previous sessions access, privacy reassurance, and challenge preview. |
| `pages/sign_in/` | Authentication entry. | Preserve centered sign-in, university email/Google options, and privacy reassurance. |
| `pages/first_time_setup/` | Initial resume and target-context setup. | Preserve resume upload/parsed state, target role fields, save draft, and continue-to-setup CTA. |
| `pages/interview_setup/` | Pre-session confirmation. | Preserve source profile, target position, detected projects/requirements, session framing, and start interview CTA. |
| `pages/main_interview_room/` | Normal live practice session workspace. | Preserve the interviewer area, transcript timeline, answer composer, target claim, required evidence, and interviewer notes. |
| `pages/live_challenge_moment/` | In-session challenge state. | Preserve challenge card, vague-claim highlight, improvement chips, and evidence room sidebar. |
| `pages/session_complete/` | Post-session completion bridge. | Preserve concise completion summary, issue counts, view report CTA, and practice again action. |
| `pages/final_coaching_report/` | Final coaching report. | Preserve readiness score, technical depth assessment, claim-defense vulnerabilities, suggested reframing, and report navigation. |
| `pages/session_history/` | Saved practice sessions. | Preserve search/filter, session table, readiness/status columns, row actions, pagination, and empty state. |
| `pages/resume_management/` | Saved resumes and claim analysis. | Preserve saved resume list, active resume detail, extracted project claims, metric badges, warnings, and suggested revisions. |
| `pages/target_role_management/` | Saved target roles and role-fit analysis. | Preserve target role list, extracted requirements, Companion notes, linked evidence references, and STAR-story prompts. |
| `pages/privacy_settings/` | Privacy and account settings. | Preserve privacy guarantee, data controls, export, clear workspace data, and account deletion hierarchy. |

Every future UI issue must reference one or more of these Stitch page folders.

## 7. Main Interview Room Requirements

MVP visual reference (historical): `docs/design/stitch/pages/main_interview_room/`.

Functional requirements:

- Show Companion brand and session context.
- Show the session type as project deep-dive.
- Show current question progress, such as question 2 of 5.
- Show remaining time or session timing state.
- Show interviewer presence with role framing, such as senior engineer.
- Show the current interviewer question prominently.
- Show a transcript timeline with completed, active, and upcoming questions.
- Show an answer composer that supports the MVP answer mode.
- Support speech-first answer capture where available; text entry is allowed as accessibility and recovery fallback.
- Show the current target claim being tested.
- Show required evidence, including baseline measurement, measurement method, and tradeoffs.
- Show interviewer notes without exposing internal reasoning or chain-of-thought.
- Keep the layout desktop-first and workspace-like, not chat-like.

Visual and interaction requirements:

- Match Stitch composition, panel density, typography, off-white academic surface, teal actions, and restrained borders.
- Preserve the three-area mental model: interviewer/work area, transcript timeline, and evidence/notes panel.
- Use visible focus states and keyboard-accessible controls.
- Deviation from Stitch is allowed only for accessibility, responsiveness, or technical feasibility.

## 8. Live Challenge Moment Requirements

MVP visual reference (historical): `docs/design/stitch/pages/live_challenge_moment/`.

Functional requirements:

- Trigger when an answer contains a vague claim, missing metric, missing baseline, missing measurement method, unclear ownership, shallow implementation detail, or role-fit gap.
- Reference the exact resume claim or target-role requirement being challenged.
- Ask one evidence-seeking follow-up at a time.
- Show why the answer is being challenged in user-facing language.
- Highlight the weak answer span or vague claim without shaming the user.
- Provide improvement chips such as adding a baseline, adding a measurement method, or adding a tradeoff.
- Show the evidence room with relevant resume snippet, related projects, and notes.
- Keep challenge pressure on the answer rather than the person.
- Respect the follow-up cap and move forward when the cap is reached.

Visual and interaction requirements:

- Preserve the red/error challenge treatment from Stitch for critical gaps.
- Preserve amber/evidence highlighting for claims or transcript spans.
- Preserve the transcript timeline context so the user remains in interview mode.
- Do not turn this into a post-session report card; it is an in-session moment.

## 9. Final Coaching Report Requirements

MVP visual reference (historical): `docs/design/stitch/pages/final_coaching_report/`.

Functional requirements:

- Show post-session context, date/session metadata, role target, and report title.
- Show overall readiness as preparation quality, not hireability.
- Show technical depth assessment with statuses such as missing, verified, and incomplete.
- Show claim-defense vulnerabilities linked to resume claims and interview responses.
- Identify missing metrics, missing tradeoffs, vague execution, unclear ownership, and shallow technical reasoning.
- Show suggested reframing with original weak answer and improved structure.
- Avoid fabricating metrics, achievements, or experience in improved answer rewrites.
- Provide clear next-practice guidance or drills.
- Allow navigation back to saved history, resumes, target roles, and new session entry.

Visual and interaction requirements:

- Preserve Stitch report hierarchy and sidebar navigation.
- Prioritize coaching intelligence over chart-heavy analytics.
- Make the report valuable within 30 seconds of reading.
- Do not include employability predictions, hiring recommendations, or comparisons to other candidates.

## 10. Resume Management Requirements

MVP visual reference (historical): `docs/design/stitch/pages/resume_management/`.

Functional requirements:

- Show saved resumes with upload date and last-used metadata.
- Let the user upload, select, edit, and delete resumes.
- Show active resume detail.
- Extract and display project claims.
- Identify concrete metrics already present in a claim.
- Identify missing baselines, vague impact, or missing evidence.
- Show suggested revisions without inventing facts.
- Support clear-all-data controls where appropriate.

Visual and interaction requirements:

- Preserve saved-resume list plus active-detail layout.
- Preserve claim analysis cards, metric badges, warning treatment, and suggested revision area.
- Keep resume data private by default.

## 11. Target Role Management Requirements

MVP visual reference (historical): `docs/design/stitch/pages/target_role_management/`.

Functional requirements:

- Show saved target roles with company/status metadata where available.
- Let the user create, edit, select, and delete target roles.
- Extract role requirements, implied needs, core skills, and leadership expectations.
- Show Companion notes that connect target-role requirements to resume gaps.
- Link relevant transcript or resume references where useful.
- Suggest preparation prompts such as drafting a STAR story when the target role exposes a gap.
- Support analyzing fit without claiming the user will or will not get hired.

Visual and interaction requirements:

- Preserve target role list plus selected-role analysis layout.
- Preserve extracted requirement cards and Companion note treatment.
- Keep role-fit analysis grounded in uploaded resume, target role, and session evidence.

## 12. Session History Requirements

MVP visual reference (historical): `docs/design/stitch/pages/session_history/`.

Functional requirements:

- Show saved practice sessions in a table-first desktop layout.
- Include date, resume, target role, readiness score, status, and actions.
- Support search and filtering.
- Support opening reports from completed sessions.
- Support deleting sessions.
- Show pagination or equivalent navigation for longer histories.
- Show an empty state that directs the user to start a project deep-dive.

Visual and interaction requirements:

- Preserve the Stitch navigation/sidebar pattern.
- Keep history subordinate to starting the next practice session.
- On mobile, table data may stack into cards if needed, but must retain the same data meaning.

## 13. Privacy/Delete Controls

MVP visual reference (historical): `docs/design/stitch/pages/privacy_settings/`, plus privacy guidance in `docs/agents/domain.md`.

Functional requirements:

- Require sign-in for saved history.
- Keep resumes, target roles, transcripts, reports, and practice drills private by default.
- Do not provide public sharing by default.
- State that user data is not used to train public models.
- Provide controls to clear workspace data.
- Provide export for session history.
- Provide account deletion.
- Provide delete controls for resumes, target roles, practice sessions, transcripts, reports, and related artifacts where surfaced.
- Avoid logging full raw resumes, target-role text, audio, or transcripts in normal telemetry.
- Store sensitive artifacts encrypted at rest where persisted.
- Preserve deletion intent with an audit event or timestamp if soft deletion is used.

Safety/privacy restrictions:

- Do not evaluate protected traits.
- Do not score facial appearance, body language, accent, race, gender, age, disability, religion, health, politics, sexuality, or other sensitive attributes.
- Do not claim employability or make hiring recommendations.

## 14. Accessibility Requirements

Accessibility is a valid reason to deviate from Stitch, but deviations must preserve the product meaning and visual tone.

Requirements:

- All interactive controls are keyboard reachable.
- Focus states are visible and consistent with the Stitch design system.
- Buttons and icon-only actions have accessible names.
- Form fields have labels and useful error messages.
- Color is not the only signal for missing, verified, incomplete, warning, or challenge states.
- Text contrast meets WCAG AA for normal and large text.
- Transcript timeline, challenge state, and report sections use semantic structure that screen readers can navigate.
- Microphone permission failures and transcription failures provide accessible recovery paths.
- Speech-first flows support typed fallback for accessibility and recovery.
- Tables in session history remain navigable; mobile card adaptations must preserve labels.
- Destructive actions such as delete account, delete resume, clear workspace data, and delete session require confirmation.
- Motion, if added later, must respect reduced-motion preferences.

## 15. Testing Strategy

Because this PRD is docs-only and production code does not yet exist, tests should be planned at the highest product boundaries first.

Product flow tests:

- Sign-in to landing entry.
- First-time setup from resume and target role to interview setup.
- Interview setup to main interview room.
- Main interview room through five-question completion.
- Main interview room into live challenge moment for vague claim fixture.
- Main interview room into live challenge moment for missing metric fixture.
- Session complete to final coaching report.
- Session history opening a completed report.
- Resume management upload/select/delete flow.
- Target role management create/select/delete flow.
- Privacy settings export, clear workspace data, and account deletion confirmation flows.

AI and domain behavior tests:

- Resume extraction identifies project claims and missing baselines.
- Target-role extraction identifies requirements and implied needs.
- Interview planner creates five technical project deep-dive questions.
- Follow-up selector respects one or two adaptive follow-ups per primary question.
- Challenge generation references exact resume claim or target-role requirement.
- Answer evaluation is grounded in transcript evidence.
- Report generation includes readiness, technical depth, vulnerabilities, suggested reframing, and next practice guidance.
- Generated copy never makes hiring predictions or protected-trait inferences.

UI fidelity tests:

- Each implemented screen has a visual review against the relevant Stitch `screen.png`.
- Shared theme matches `pages/academic_precision/DESIGN.md` for typography, surface colors, borders, radius, and accent usage.
- Desktop layouts preserve Stitch information density and panel hierarchy.
- Mobile adaptations preserve task order and semantic meaning.

Accessibility and privacy tests:

- Keyboard navigation works across all core flows.
- Screen-reader labels exist for icon buttons and destructive actions.
- Challenge, warning, and status states are not color-only.
- Users cannot access another user's private artifacts.
- Deletion controls remove or mark artifacts according to the chosen retention design.
- Logs do not contain full raw resumes, target-role text, transcripts, or audio payloads in normal operation.

## 16. MVP Acceptance Criteria

The MVP is accepted when:

1. The implemented UI references and substantially matches the Stitch page folders listed in this PRD.
2. The previous Codex-generated prototype UI is not used as the production baseline.
3. A user can sign in.
4. A user can start a project deep-dive from the entry/dashboard experience.
5. A user can upload, select, edit, and delete resumes.
6. A user can create, select, edit, and delete target roles.
7. Companion extracts project claims, metrics, gaps, and target-role requirements.
8. Companion blocks session start when unresolved extraction uncertainty requires review.
9. The interview setup screen shows source profile, target position, detected context, five-question framing, and start interview CTA.
10. The main interview room includes interviewer presence, transcript timeline, answer composer, target claim, required evidence, and interviewer notes.
11. The session supports speech-first answering where available and typed fallback for accessibility or recovery.
12. A practice session contains five primary questions and no more than one or two adaptive follow-ups per primary question.
13. Controlled vague-claim fixtures trigger the live challenge moment.
14. Controlled missing-metric fixtures trigger the live challenge moment.
15. The live challenge moment references the exact claim or requirement being challenged.
16. The live challenge moment pressures the answer, not the person.
17. Session completion leads to a final coaching report.
18. The final coaching report includes readiness, technical depth assessment, claim-defense vulnerabilities, suggested reframing, and next practice guidance.
19. Reports do not make employability predictions, hiring recommendations, or protected-trait inferences.
20. Session history lists saved sessions and supports opening and deleting session artifacts.
21. Resume management shows extracted project claims, metrics, warnings, and suggested revisions.
22. Target role management shows extracted requirements, Companion notes, role gaps, and preparation prompts.
23. Privacy settings provide private-by-default messaging, export, clear workspace data, and account deletion controls.
24. Users can delete sensitive artifacts exposed in the MVP.
25. Core flows pass keyboard navigation and accessible-name checks.
26. Mobile adaptations remain usable for sign-in, report review, short practice, and management basics.
27. No payment, subscription, employer workflow, public sharing default, animated avatar, fully realtime two-way voice, coding editor, video analysis, or body-language scoring exists in the MVP.

## Open Questions / Assumptions

- Assumption: Stitch is authoritative over earlier UI wording when screen layout or component hierarchy differs.
- Assumption: Stitch is authoritative for composition, hierarchy, and interaction shape; `CONTEXT.md`, ADRs, and this PRD remain authoritative for product behavior and MVP scope when static mock copy conflicts.
- Assumption: Existing domain docs remain authoritative for product behavior when Stitch only shows static sample data.
- Assumption: The `landing_entry` page functions as the initial entry/dashboard gateway until a separate dashboard design exists.
- Assumption: The `first_time_setup` page covers initial setup, while `resume_management` and `target_role_management` cover ongoing library management.
- Assumption: Speech-first remains a product requirement even though the Stitch `main_interview_room` export visibly includes a text composer; typed entry is treated as accessibility/recovery unless a later ADR changes the input model.
- Assumption: Until Stitch includes a dedicated extraction-review page, unresolved extraction review should reuse the visual language of `first_time_setup` and `interview_setup` while still blocking session start.
- Assumption: Suppress the static Billing tab shown in `privacy_settings` for MVP because payments and subscriptions are non-goals.
- Assumption: Session history readiness scores are preparation signals, not hiring predictions.
- Resolved conflict: Stitch `interview_setup` includes the phrase "Text-first" while domain guidance says speech-first. This PRD resolves the conflict in favor of speech-first per `CONTEXT.md` and `docs/agents/domain.md`, with typed entry as fallback.
- Resolved conflict: Some Stitch sample copy references system design. This PRD resolves the conflict in favor of the technical project deep-dive MVP; system design remains outside first-class MVP scope.
- Open question: Should a dedicated Stitch extraction-review page be generated before implementation, or should the first implementation adapt the existing setup pages?
- Open question: Should deletion be immediate hard delete or soft delete with a short retention period?
- Open question: Which resume formats are supported first: PDF only, PDF + DOCX, or paste-first?
- Open question: Should extracted claim edits persist permanently to the resume/target role or only to the current practice session?
- Open question: What exact readiness scale should the report use: numeric, qualitative, or both?
