# Stitch Implementation Notes

> **Historical reference — no longer authoritative.** See [ADR 0003](../../adr/0003-adopt-in-repo-design-system.md); the UI source of truth is now [`docs/design/design-system.md`](../design-system.md). These notes describe how the MVP screens were built from Stitch and are retained for context only.

Stitch was the MVP UI source of truth for Companion. The shipped screens were implemented faithfully from the Stitch design rather than redesigned during translation to production code.

## Implementation Rules

- Start every UI issue by identifying the relevant folder under `docs/design/stitch/pages/`.
- Match `screen.png` first for composition, hierarchy, spacing, density, and tone.
- Use `code.html` as a structural reference, not as production-ready code.
- Use `pages/academic_precision/DESIGN.md` for shared tokens, typography, surfaces, borders, component radius, and interaction tone.
- Preserve the "Modern Academic Rigor" direction: calm, focused, precise, desktop-first, and interview-workspace oriented.
- Do not revive the previous Codex-generated prototype UI. It was rejected and is not the production baseline.
- Any deviation from Stitch must be justified by accessibility, responsiveness, or technical feasibility.
- If a deviation is needed, document the reason in the implementation PR or issue and keep the result visually compatible with the relevant Stitch page.
- Treat Stitch as authoritative for layout, visual hierarchy, component treatment, and interaction shape. If static mock copy conflicts with `CONTEXT.md`, ADRs, or the PRD, preserve the Stitch UI structure but update the product copy/behavior to the documented MVP direction.
- In particular, do not interpret sample Stitch references to "Text-first" or "System Design" as permission to move away from the speech-first technical project deep-dive MVP. Do not implement the static Billing tab from `privacy_settings` for MVP because payments and subscriptions are non-goals.

## Priority Implementation Order

1. `pages/main_interview_room/`
   Build the standard practice session workspace first. Preserve the interviewer area, transcript timeline, answer composer, target claim panel, required evidence checklist, and interviewer notes.

2. `pages/live_challenge_moment/`
   Build the challenge state as an extension of the interview room, not as a separate visual system. Preserve the red challenge treatment, highlighted vague claim, answer-improvement chips, and evidence room sidebar.

3. `pages/final_coaching_report/`
   Build the report as the payoff for the session. Preserve readiness, technical depth, claim-defense vulnerabilities, and suggested reframing as the central report hierarchy.

## Screen-by-Screen Guidance

### `academic_precision`

Use this as the shared design-system reference. The app should use off-white academic surfaces, deep teal primary actions, amber evidence accents, red challenge/gap states, IBM Plex Sans for structural headings, Inter for body text, and IBM Plex Mono for technical metadata.

Prefer tonal layering and 1px borders over heavy shadows. Cards and panels should feel precise and work-focused, usually with 4px to 8px radius.

### `landing_entry`

Use this as the product entry surface. The page explains Companion through claim defense, not generic interview prep. Preserve the primary "Start project deep-dive" action, previous sessions access, private-by-default reassurance, and embedded challenge preview.

### `sign_in`

Use this for authentication. Preserve the quiet centered layout, university email/Google options, and privacy guarantee. Avoid adding marketing-heavy content here.

### `first_time_setup`

Use this for guided setup. Preserve the two-column rhythm: resume/profile input on the left and target context on the right. Include the parsed-resume success state and continue-to-setup CTA.

### `interview_setup`

Use this as the final pre-session confirmation. Preserve the source profile, target position, detected projects/requirements, and the five-question, 10-12 minute, evidence-focused framing.

Stitch does not currently include a separately named extraction-review page. If extraction is uncertain, implement the required confirmation/editing state using the visual language of `first_time_setup` and `interview_setup` until a dedicated Stitch page exists. The session must still be blocked until unresolved extraction uncertainty is confirmed or corrected.

### `main_interview_room`

Use this as the primary interview room. It should feel like a focused desktop workspace, not a chat app. Preserve the session header, interviewer card, transcript timeline, answer composer, target claim, required evidence checklist, and notes panel.

### `live_challenge_moment`

Use this for adaptive follow-up pressure. It should clearly show why Companion is challenging the answer while keeping pressure on the answer, not the person. Preserve the challenge card, vague-claim highlight, suggested improvement chips, and evidence room.

### `session_complete`

Use this as the short bridge after a session ends. Preserve the concise completion summary, found issue counts, "View coaching report" CTA, and "Practice again" secondary action.

### `final_coaching_report`

Use this as the post-session report source of truth. Preserve the sidebar navigation, readiness score, technical depth assessment, claim-defense vulnerabilities, resume-claim problem cards, and improved answer reframing.

### `session_history`

Use this for saved history. Preserve the table-first desktop layout, search/filter controls, readiness score/status columns, row actions, pagination, and empty state.

### `resume_management`

Use this for saved resumes and extracted claim quality. Preserve the saved-resume list, active resume detail, project claim analysis, metric badges, baseline warnings, and suggested revision treatment.

### `target_role_management`

Use this for saved roles and role-fit analysis. Preserve the target-role list, extracted requirements, Companion notes, linked resume/transcript references, and STAR-story preparation prompts.

### `privacy_settings`

Use this for privacy and data controls. Preserve the privacy guarantee, data handling bullets, clear workspace data, export history, and account deletion hierarchy. Suppress the static Billing tab for MVP unless a later ADR introduces payments or subscriptions.

## Responsiveness and Accessibility

Stitch is desktop-first. Keep desktop fidelity high, then adapt mobile by preserving task order and visual hierarchy. Mobile may stack panels, collapse side navigation, or simplify dense tables, but it must not change the product meaning of the screen.

Accessibility improvements are valid deviations when they improve keyboard navigation, focus states, contrast, semantic structure, readable labels, or screen-reader behavior. Do not use accessibility as a reason to change the product direction or visual tone.

## Production Translation

When translating Stitch into production components:

- Convert repeated navigation, panels, buttons, evidence chips, and claim cards into shared components.
- Keep text labels close to Stitch unless product copy has already been superseded in `CONTEXT.md`, ADRs, or PRDs.
- Prefer real application state over static mock content, but preserve the visible state shape shown by Stitch.
- Keep implementation issues vertically sliced by page or by a shared component used by named Stitch pages.
