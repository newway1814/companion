---
name: Companion
description: The Cockpit at Night — a dark, instrument-grade interview sparring workspace.
colors:
  background: "#0e1116"
  surface-dim: "#0a0d11"
  surface-container-lowest: "#161b22"
  surface-container-low: "#1b222b"
  surface-container: "#1f2630"
  surface-container-high: "#252d38"
  surface-container-highest: "#2b333f"
  surface-bright: "#1b222b"
  on-surface: "#e6edf3"
  on-surface-variant: "#9aa4b2"
  outline: "#3a434f"
  outline-variant: "#2a313c"
  primary: "#2dd4bf"
  primary-container: "#0d9488"
  on-primary: "#04211c"
  on-primary-container: "#ccfbef"
  evidence: "#e7b24a"
  on-evidence: "#f5c77a"
  evidence-container: "#b7791f"
  on-evidence-container: "#fcd9a0"
  tertiary: "#4d8df0"
  on-tertiary-container: "#dce6ff"
  error: "#f0635e"
  error-container: "#5a1a1a"
  on-error-container: "#fca5a0"
  success: "#3fb950"
  on-success: "#04210a"
typography:
  display-lg:
    fontFamily: "IBM Plex Sans, Inter, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: "3rem"
    letterSpacing: "-0.02em"
  display-md:
    fontFamily: "IBM Plex Sans, Inter, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: "2.5rem"
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: "IBM Plex Sans, Inter, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: "2rem"
  section-title:
    fontFamily: "IBM Plex Sans, Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "0.01em"
  body-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.625rem"
  body-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  label-caps:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: "1rem"
    letterSpacing: "0.05em"
  mono-label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: "1.125rem"
rounded:
  DEFAULT: "4px"
  lg: "8px"
  full: "9999px"
spacing:
  unit-base: "8px"
  gutter: "24px"
  sidebar-width: "320px"
  container-max: "1440px"
  panel-gap: "1px"
components:
  button-primary:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 16px"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 16px"
    height: "40px"
  input:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 12px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  claim-card:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  evidence-chip:
    backgroundColor: "{colors.evidence}"
    textColor: "{colors.on-evidence}"
    rounded: "{rounded.DEFAULT}"
    padding: "2px 8px"
  status-badge:
    textColor: "{colors.on-surface}"
    rounded: "{rounded.DEFAULT}"
    padding: "2px 8px"
---

# Design System: Companion

> Scope: This system governs authenticated product surfaces. The public marketing landing page is a separate visual context defined by [ADR 0005](docs/adr/0005-separate-marketing-and-product-visual-languages.md); that exception does not change the authenticated workspace.

## 1. Overview

**Creative North Star: "The Cockpit at Night"**

Companion is an instrument panel in a darkened cabin. The candidate is flying the interview; the surfaces recede into near-black so the readouts, the live question, and the single electric-teal glow of "what's active right now" carry the whole cabin. Nothing is decorative. Every panel earns its place because a pilot under pressure needs it legible at a glance. This is the physical scene the whole system answers to: one person, alone, at night, doing something that matters, with precise instruments and no noise.

The mood is **rigorous, calm, honest** — a demanding-but-fair senior engineer, not a cheerful study app and not a "magical AI" toy. Depth comes from **tonal layering and 1px hairlines**, never from drop shadows or glass. Density is high and IDE-like: the flagship interview room is a three-pane workspace (interviewer/work · transcript timeline · evidence/notes) delimited by borders, not wide gutters. Color is strictly semantic — teal means *action/live*, amber means *evidence*, red means *challenge/gap*, green means *success* — and it is rationed so that when a color appears, it means something.

This system explicitly rejects: the **generic SaaS dashboard** (card grids, hero-metric tiles, gradient-and-glow), the **playful edtech app** (mascots, confetti, streaks, rounded-bubbly friendliness), the **chatbot thread** (a centered message list is the wrong mental model for an interview room), and **"magical AI" spectacle** (sparkles, glowing orbs, animated avatars, exposed chain-of-thought). It never reads as a hiring verdict.

**Key Characteristics:**
- Near-black canvas (#0e1116) with panels layered up in tonal steps, not shadows.
- One vivid accent — electric teal — reserved for action and the live/active state.
- 1px hairline borders (#2a313c) separate panels; depth is tonal, not lifted.
- Three semantic status colors (amber / red / green), each always paired with a non-color signal.
- Precise, dense, workspace-grade layout capped at 1440px on an 8px rhythm.
- Typography splits work: IBM Plex Sans structures, Inter reads, IBM Plex Mono for IDs/metadata.

## 2. Colors

A near-black cabin of layered graphite surfaces, lit by a single teal signal and three tightly-rationed status hues.

### Primary
- **Electric Teal** (`#2dd4bf`): The live signal. Accent text, active nav, focus rings, icons, and the *hover* state of primary buttons. This is "what is active / what you can act on right now."
- **Deep Teal (Button Fill)** (`#0d9488`): The resting fill of primary buttons and the brand mark chip. Brightens to Electric Teal on hover. Paired with near-black on-primary text (`#04211c`) for a crisp, legible action.

### Secondary
- **Evidence Amber** (`#e7b24a`): Reserved *exclusively* for evidence — the claim being tested, transcript spans, evidence chips, and unproven "hypothesis" claim accents. Amber never means "action" and never means "warning-as-error." On dark amber tints, text lightens to `#f5c77a` (on-evidence).

### Tertiary
- **Signal Blue** (`#4d8df0`): Rare informational accent (links, neutral references) where teal would wrongly imply a primary action. Use sparingly; teal and amber carry most of the meaning.

### Neutral
- **Cabin Black** (`#0e1116`): The canvas / body background. Also the docked sidebar and app frame.
- **Instrument Graphite** (`#161b22` → `#2b333f`): The surface-container ramp. Panels and cards sit at `surface-container-lowest` (#161b22); hover, raised, and nested states step up through the ramp. This tonal ladder *is* the elevation system.
- **Readout White** (`#e6edf3`): Primary text (on-surface). Soft near-white, never pure #fff, for reduced glare in a dark cabin.
- **Muted Steel** (`#9aa4b2`): Secondary text (on-surface-variant) — labels, metadata, inactive nav. Verified ≥4.5:1 on Cabin Black; never lighten it further "for elegance."
- **Hairline** (`#2a313c` outline-variant, `#3a434f` outline): The 1px borders that partition the workspace. Structural, not decorative.

### Status (semantic, non-negotiable)
- **Challenge Red** (`#f0635e`, container `#5a1a1a`, text `#fca5a0`): Critical gaps — missing metric, unsupported claim, the live challenge moment. Pressures the *answer*, never the person.
- **Success Green** (`#3fb950`): Verified claims, completed states, confirmations.

### Named Rules
**The One Signal Rule.** Electric teal is the *only* action/live color. It appears on ≤10% of any screen — a focus ring, an active nav item, one primary button. Its rarity is what makes "active" instantly readable. If two things on screen glow teal, one of them is wrong.

**The Semantic-Color Rule.** Teal = action/live, amber = evidence, red = challenge/gap, green = success. A color is never chosen for decoration or variety. If a hue can't be justified by one of those four meanings, it doesn't ship.

**The No-Pure-Black, No-Pure-White Rule.** The canvas is #0e1116, not #000; text is #e6edf3, not #fff. The softened contrast is what keeps a long, dark session calm instead of harsh.

## 3. Typography

**Display Font:** IBM Plex Sans (with Inter, sans-serif fallback)
**Body Font:** Inter (with ui-sans-serif, system-ui fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace)

**Character:** A deliberate contrast pairing — IBM Plex Sans is engineered and slightly technical for structure; Inter is a quiet, highly-legible humanist workhorse for reading-intensive transcript and report text. Plex Mono handles anything machine-generated (session IDs, timestamps, technical references) so "system output" reads visually distinct from human prose. The two sans families are paired on a contrast axis (structural vs. reading), never used interchangeably.

### Hierarchy
- **Display Large** (600, 2.5rem / 40px, line-height 3rem, tracking -0.02em): Page-level titles — report headline, landing hero. Scales down on mobile to avoid wrapping.
- **Display Medium** (600, 2rem / 32px, line-height 2.5rem, tracking -0.01em): Major section headers and setup step titles.
- **Headline Small** (500, 1.5rem / 24px): Panel and card group headings.
- **Section Title** (600, 1.125rem / 18px, tracking 0.01em): The workhorse heading — panel titles, card titles, the current interviewer question framing.
- **Body Large** (400, 1rem / 16px, line-height 1.625rem): Primary reading text — the interviewer question, transcript answers, report prose. Cap measure at 65–75ch.
- **Body Medium** (400, 0.9375rem / 15px): Dense UI text — controls, list rows, secondary detail.
- **Label Caps** (700, 0.75rem / 12px, tracking 0.05em, UPPERCASE): Metadata and speaker labels — transcript speaker, chip text, status badge text.
- **Mono Label** (400, 0.8125rem / 13px, IBM Plex Mono): Technical metadata and system-generated IDs.

### Named Rules
**The Mono-Means-Machine Rule.** IBM Plex Mono is reserved for machine-generated content (IDs, timestamps, technical references). Human prose — questions, answers, coaching — is never set in mono. The typeface itself signals who is "speaking."

**The Display-Ceiling Rule.** Display Large tops out at 2.5rem/40px. This is an instrument panel, not a marketing hero; type earns hierarchy through weight, spacing, and the mono/sans split, not through size shouting.

## 4. Elevation

This system uses **no drop shadows**. Depth is communicated entirely through **tonal layering + 1px outlines** — the "instrument panel" model. A raised panel is a lighter step on the graphite ramp (`surface-container-lowest` → `surface-container` → `surface-container-high`) plus a hairline border, not a shadow lift. The active state of a card or input is a **2px teal border**, not elevation.

Depth ladder:
- **Level 0 — Cabin (`#0e1116`)**: canvas, sidebar, app frame.
- **Level 1 — Panel (`#161b22`)** + 1px `outline-variant` border: cards, panels, inputs at rest.
- **Level 2 — Raised (`#1f2630`–`#252d38`)**: hover states, nested surfaces, popovers. Step up the ramp instead of casting a shadow.
- **Active/Focus**: 2px teal (`#2dd4bf`) border or a `ring-2` teal focus ring — the only "lift" in the system.

### Named Rules
**The No-Shadow Rule.** Drop shadows and glassmorphism are forbidden. If a surface needs to feel raised, step it one level up the graphite ramp and give it a hairline border. Depth is tonal, never cast.

**The Focus-Is-Teal Rule.** Selection and focus are shown by a teal border/ring, not by growing, shadowing, or scaling the element. Under pressure the pilot needs to know *what's active*, and teal is that answer everywhere.

## 5. Components

### Buttons
- **Shape:** Clipped, precise (4px radius). Height 40px (md) / 32px (sm), horizontal padding 16px/12px. Icon+label gap 8px.
- **Primary:** Deep Teal fill (`#0d9488`) with near-black text (`#04211c`); brightens to Electric Teal (`#2dd4bf`) on hover. The single strongest action on any screen.
- **Secondary:** `surface-container-lowest` fill with a 1px `outline-variant` border and Readout White text; hover steps up to `surface-container-low`.
- **Ghost:** No fill or border; Muted Steel text that resolves to Readout White with a `surface-container-low` wash on hover. For low-emphasis and tertiary actions.
- **Focus:** 2px teal ring with a 2px surface offset (`ring-primary ring-offset-surface`). Disabled: 50% opacity, no pointer events.

### Chips
- **Evidence Chip:** Amber at ~15% opacity background, `on-evidence` (#f5c77a) uppercase Label-Caps text, 4px radius, 2px×8px padding. Tags transcript evidence and resume snippets. Amber only — a chip is never teal or red.

### Status Badge (signature)
- **Style:** Pill-adjacent (4px radius) with a **required leading icon** + uppercase Label-Caps text, on a ~15–25% tint of its status color.
- **States:** Verified (green, check), Missing (red, ✕), Incomplete (amber, dashed circle), Warning (amber, triangle). The icon is mandatory — status is never signaled by color alone.

### Cards / Containers
- **Corner Style:** 8px radius (`rounded-lg`) for cards and panels; chips/buttons/inputs stay at 4px.
- **Background:** `surface-container-lowest` (#161b22).
- **Elevation Strategy:** Flat. 1px `outline-variant` border only — see Elevation. No shadow.
- **Padding:** 24px (Card), 16px (Claim Card), on the 8px scale.
- **Panel** variant: a *flush* container with border on all sides and no radius, used to partition the three-pane workspace (borders touch, gutters don't separate).
- **Claim Card:** 8px card with a **4px left accent bar** — teal for verified claims, amber for unproven hypotheses. (This is the one sanctioned colored left-edge in the system; it encodes claim status, and it always pairs with a full border, never a bare stripe.)

### Inputs / Fields
- **Style:** `surface-container-lowest` fill, 1px `outline-variant` border, 4px radius, 40px height, Readout White text. Placeholder at `on-surface-variant/60` — still ≥4.5:1, never fainter.
- **Focus:** Border shifts to Electric Teal + a soft 2px teal ring at 20% opacity. No glow, no shadow.
- **Disabled:** 50% opacity, not-allowed cursor.

### Navigation
- **Style:** Docked left sidebar (320px) on Cabin Black with a hairline right border; icon + Body-Medium label rows at 8px radius. Off-canvas drawer on mobile with a focus-trapped, Escape-closable panel and a top bar.
- **States:** Active = `surface-container-low` wash + semibold + Electric Teal text/icon. Inactive = Muted Steel, resolving to Readout White with a `surface-container-low` wash on hover. Active also carries `aria-current`.
- **Brand:** Plex Sans wordmark in teal + a Label-Caps "Interview Research Studio" tagline, above a full-width primary "New session" action.

### Transcript Row (signature)
- **Style:** Tight vertical stack — uppercase Label-Caps speaker on Muted Steel, Body-Medium turn text on Readout White, 8px radius, row padding 8px×16px.
- **States:** Active turn = `surface-container-low` wash + `aria-current="step"`; upcoming = 60% opacity; completed = full opacity, no wash. State is carried by `data-state` + opacity + aria, not by color alone.

## 6. Do's and Don'ts

### Do:
- **Do** keep electric teal (#2dd4bf) rare — one live/active signal per view, ≤10% of the surface. Its scarcity is the point.
- **Do** convey depth with tonal steps on the graphite ramp (#161b22 → #2b333f) plus 1px `outline-variant` (#2a313c) borders.
- **Do** pair every status with a non-color signal — an icon, label, or shape — so Missing/Verified/Incomplete/Warning read for color-blind users and screen readers.
- **Do** use IBM Plex Mono only for machine output (IDs, timestamps, technical refs); set all human prose in Inter.
- **Do** show focus and selection with a 2px teal border/ring on a surface offset — the only "lift" in the system.
- **Do** keep the interview room a three-pane workspace partitioned by borders (interviewer/work · transcript · evidence/notes).
- **Do** keep body text at Readout White (#e6edf3) on Cabin Black; bump toward ink before ever lightening it.

### Don't:
- **Don't** ship a **generic SaaS dashboard** — no card grids of identical icon-heading-text tiles, no hero-metric tiles, no gradient-and-glow "AI product" chrome.
- **Don't** make it a **playful edtech app** — no mascots, confetti, streaks, badges, or rounded-bubbly friendliness on a high-stakes moment.
- **Don't** turn the interview room into a **chatbot thread** — a centered message list with a text box is the wrong mental model.
- **Don't** use **"magical AI" spectacle** — no sparkles, glowing orbs, animated avatars, faux-realtime-voice theater, or exposed chain-of-thought as decoration.
- **Don't** use drop shadows or glassmorphism for elevation; step the tonal ramp instead. If it looks like it's floating, it's wrong.
- **Don't** use pure black (#000) or pure white (#fff); the softened #0e1116 / #e6edf3 pair is what keeps long dark sessions calm.
- **Don't** use color as decoration or for variety — every hue must resolve to action, evidence, challenge, or success.
- **Don't** add a bare colored side-stripe as an accent; the only sanctioned left bar is the Claim Card status accent, and it always pairs with a full border.
- **Don't** present any element as a hiring verdict, pass/fail, or employability score — readiness is preparation quality, never hireability.
