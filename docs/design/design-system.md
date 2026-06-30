# Companion Design System

This is the **source of truth for Companion's UI/UX** (see [ADR 0003](../adr/0003-adopt-in-repo-design-system.md)). It is a living document: design decisions — palette, typography, spacing, components, theming — are proposed and recorded here, then implemented through the design tokens in `src/app/globals.css`. New screens are designed against this document, not transcribed from mockups.

The earlier Stitch mockups under `docs/design/stitch/` are historical reference only.

## How we work

- **Tokens first.** Everything is themed through CSS variables in `src/app/globals.css` (`--color-*`, the `--text-*` scale, spacing). Components consume tokens (`bg-primary`, `text-on-surface`, `bg-evidence`) — never hard-coded hex. A palette change is a token change that re-skins the whole app.
- **Semantic colour roles.** Colour carries meaning: teal = action/primary, amber = evidence, red = challenge/gap, green = success. Keep roles stable even if hues change.
- **Evolving the design.** To change direction (new palette, dark mode, new component), update this doc + the tokens together in one PR so the system stays coherent. Significant shifts get an ADR.
- **Non-negotiables regardless of look:** accessibility (keyboard, focus, contrast, non-colour status signals), responsiveness (desktop-first, usable on mobile), and the calm "interview workspace" identity (not a generic SaaS dashboard or playful study app).

## Brand & direction

**Focused Cockpit** — a dark, high-contrast "serious instrument" for high-stakes interview prep: spacious and modern (examtaker-inspired polish + smooth motion) over a near-black canvas, calm and focused rather than busy. Evolved from the original light "Modern Academic Rigor" MVP; the semantic colour roles carried over.

## Colour (dark)

Near-black canvas, layered panels, one vivid accent. Token values live in `globals.css`:

- **Surfaces:** canvas `--color-background` `#0e1116`; raised panels/cards `surface-container-lowest` `#161b22`, stepping up through `surface-container-*`. Hairlines `outline-variant` `#2a313c` (no heavy shadows).
- **Text:** `on-surface` `#e6edf3`; secondary `on-surface-variant` `#9aa4b2`.
- **Primary (action, electric teal):** `primary` `#2dd4bf` (bright — accent text/icons/active states), `primary-container` `#0d9488` (button fill), `on-primary` `#04211c` (dark text on teal; hover brightens fill to `primary`).
- **Evidence (amber):** `evidence` `#e7b24a`, `on-evidence` `#f5c77a` (light text on dark amber tints).
- **Challenge / error (red):** `error` `#f0635e`, `error-container` `#5a1a1a`, `on-error-container` `#fca5a0`.
- **Success (green):** `success` `#3fb950`.

When the palette evolves, change the token values here + in `globals.css`; the semantic names stay. A light theme is a future option (see backlog).

## Motion

Smooth, purposeful motion via **framer-motion**. Intensity scales with surface:

- **Marketing / auth / landing:** expressive — entrance fade-ups and staggered reveals (`src/components/motion/reveal.tsx`), an ambient accent glow. This is the "wow" layer.
- **Inside the app (interview room, management):** restrained, functional — smooth hover/press, route/state transitions, the challenge moment animating in. High-focus surfaces must not distract.
- Always respect `prefers-reduced-motion` (the `Reveal` primitive renders static when set). Easing: `[0.22, 1, 0.36, 1]`, ~0.4–0.5s.

## Typography

- **Headings / structure:** IBM Plex Sans (`--font-heading`), tighter tracking on displays.
- **Body:** Inter (`--font-sans`), generous line height for scanning.
- **Technical metadata / IDs:** IBM Plex Mono (`--font-mono`), via `mono-label`.
- Scale: `display-lg/md`, `headline-sm`, `section-title`, `body-lg/md`, `label-caps`, `mono-label` (defined in `globals.css`).

## Layout & elevation

- **Three-pane interview workspace:** interviewer/work area, centre, evidence/notes — separated by 1px borders, not wide gutters (IDE/research-tool feel). Content capped at `container-max` (1440px); 8px spacing rhythm; `gutter` = 24px.
- **Depth via tonal layering + 1px outlines, not heavy shadows.** Focused inputs/cards use a 2px teal border rather than an elevation lift.

## Shapes & components

- **Radius:** 4px (`rounded`) for buttons/inputs/chips; 8px (`rounded-lg`) for cards/panels.
- **Buttons:** primary = solid teal + white; secondary = white + 1px outline. (`src/components/ui/button.tsx`)
- **Evidence chips:** amber at ~15% opacity. (`src/components/ui/evidence-chip.tsx`)
- **Claim cards:** white, 8px radius, 4px left accent bar (teal = verified, amber = hypothesis). (`src/components/ui/claim-card.tsx`)
- **Transcript rows:** tight spacing, row-hover highlight, non-colour state signals. (`src/components/ui/transcript-row.tsx`)
- Reuse the shared primitives in `src/components/ui/` before inventing new ones.

## Backlog / open design decisions

Track here as they come up:

- **Light theme option** — the app is dark-first ("Focused Cockpit"); a light theme could return as an opt-in via a `[data-theme]` token override.
- Roll the dark re-skin polish through every screen (landing + sign-in done first; tune contrast/motion per screen).
- Component coverage: skeleton/loading states, toasts, modals/dialogs.
