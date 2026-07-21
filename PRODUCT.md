# Product

## Register

product

## Users

University students preparing for **software internship / early-career SWE interviews**. They have at least one resume project that would be hard to defend under skeptical follow-up, and they want realistic practice before facing a real interviewer. Today they prepare with friends, career centers, LeetCode, YouTube, or generic ChatGPT roleplay — none of which pressure *their actual resume and target role* in real time.

Context of use: desktop-first, alone, in a focused prep session (often the night before or the week of an interview). The emotional state is a mix of anxiety and determination. They value privacy — resumes, transcripts, and reports are sensitive career data.

The job to be done: **"Make me defend my resume claims out loud, under pressure, and show me exactly where I'm weak — before a real interviewer does."**

## Product Purpose

Companion is a private AI **interview sparring partner** — a practice tool, not a hiring or candidate-ranking system. The MVP is a single flagship mode: a **technical project deep-dive**, a bounded five-question session (~10–12 min) with one or two adaptive follow-ups per question.

The core loop: sign in → set up resume + target role → review what Companion extracted → enter a speech-first interview room → answer out loud → get hit with *adaptive follow-up pressure* when an answer is vague, unsupported, or missing metrics → finish with a coaching report that turns the session into concrete, actionable feedback.

The differentiator is **adaptive follow-up pressure** grounded in the user's real resume and target role. When it detects a weak answer, it references the exact claim ("you said the system got faster — what was the baseline, and what did *you* build?") and pushes for ownership, implementation detail, tradeoffs, and measured results.

Success looks like: the user completes a first session, reads the report, recognizes at least one weakness as genuinely useful, reads an improved-answer rewrite, and comes back to practice again within a week. Trust is the whole game — one bad, generic evaluation and they leave.

## Brand Personality

**A demanding-but-fair senior engineer conducting a one-on-one interview.** Three words: **rigorous, calm, honest.**

- Voice: direct and specific, never cruel. It pressures the *answer*, not the person. It asks evidence-seeking questions; it never diagnoses personality, flatters, or hedges into vague praise.
- Tone: composed and high-stakes. The room should feel quiet, serious, and a little tense — like sitting across from someone whose time is valuable and who is genuinely evaluating your reasoning.
- Emotional goals: **focus and productive pressure** during the session; **clarity and momentum** in the report ("here's exactly what to fix, and how"). Never anxiety-for-its-own-sake, never gamified cheer.
- It is a *sparring partner*: on your side, but it earns trust by being honest rather than encouraging.

## Anti-references

- **Generic SaaS dashboard** — card-grid-and-sidebar admin templates, hero-metric tiles, the "AI product" gradient-and-glow look. Companion is a workspace, not an analytics dashboard.
- **Playful study / edtech app** — mascots, confetti, streaks, badges, rounded-bubbly friendliness, Duolingo-style gamification. This trivializes a high-stakes moment.
- **Chatbot UI** — a centered message thread with a text box is the wrong mental model. This is an *interview room*, not a chat.
- **"Magical AI" tropes** — sparkles, glowing orbs, animated avatars, faux-realtime-voice theater, chain-of-thought exposed as decoration. Utility and structural clarity over spectacle.
- **The rejected Codex prototype** — must never be revived or borrowed from.
- **Anything that reads as a hiring/scoring verdict** — no pass/fail, no employability score, no candidate-ranking framing. Readiness is *preparation quality*, never hireability.

## Marketing Surface

The public landing page is an acquisition surface, not part of the interview workspace. It may use a distinct cinematic 3D language to demonstrate adaptive follow-up pressure, while preserving Companion's rigorous, calm, honest voice and all privacy and safety boundaries. This exception is limited to logged-out marketing and does not authorize redesigning authenticated product surfaces.

## Design Principles

1. **Pressure the answer, not the person.** Every challenge, highlight, and report line stays on the work. The UI can be intense and demanding, but never shaming — no red "wrong" verdicts on the human, only precise gaps in the argument.
2. **A workspace, not a dashboard.** Three-pane, instrument-like, IDE-calm: interviewer/work area · transcript timeline · evidence/notes. Density and hairlines over cards and gutters. It should feel like a serious tool you *operate*, not a page you browse.
3. **Evidence is always in view.** The user should always see what claim is being tested and what evidence is required. Grounding the pressure in their real resume is the product; surface it, don't bury it.
4. **Coaching over analytics.** The report's value is specific, actionable coaching — the weakest answer, the missing metric, the improved rewrite, the next drill — read in 30 seconds. Not a wall of charts.
5. **Earn trust through honesty and privacy.** Specific over generic, private by default, never fabricate metrics or achievements in rewrites, never claim certainty the transcript doesn't support. Visible, trustworthy control over sensitive data.
6. **Calm carries the tension.** Restraint *is* the high-stakes feeling. Motion and color are purposeful and semantic (teal = action, amber = evidence, red = challenge, green = success); the room stays quiet so the questions land.

## Accessibility & Inclusion

- **WCAG 2.1 AA** minimum. Body text ≥4.5:1, large/bold text ≥3:1, against the dark canvas.
- **Status is never color-only.** Missing / verified / incomplete / warning / challenge states carry an icon, label, or shape in addition to hue (critical on a red/amber/green semantic palette, and for color-blind users).
- **Keyboard-complete.** Every interactive control is reachable and operable by keyboard, with visible, consistent focus states (2px teal border, not an elevation lift).
- **Speech-first with typed fallback.** Voice is the primary answer mode, but typed entry is a first-class accessibility and recovery path. Microphone-permission and transcription failures always have an accessible recovery route.
- **Names and labels.** Icon-only actions have accessible names; form fields have labels and useful error messages; the transcript timeline, challenge state, and report use semantic structure a screen reader can navigate.
- **Reduced motion is respected everywhere.** Every animation has a `prefers-reduced-motion` alternative (crossfade or instant); reveal animations enhance already-visible content, never gate it.
- **Destructive actions confirm.** Delete account / resume / session and clear-workspace-data require confirmation.
