# Companion Design System

This is the **source of truth for Companion's UI/UX** (see [ADR 0003](../adr/0003-adopt-in-repo-design-system.md)). It is a living document: design decisions — palette, typography, spacing, components, theming — are proposed and recorded here, then implemented through the design tokens in `src/app/globals.css`. New screens are designed against this document, not transcribed from mockups.

The earlier Stitch mockups under `docs/design/stitch/` are historical reference only.

## How we work

- **Tokens first.** Everything is themed through CSS variables in `src/app/globals.css` (`--color-*`, the `--text-*` scale, spacing). Components consume tokens (`bg-primary`, `text-on-surface`, `bg-evidence`) — never hard-coded hex. A palette change is a token change that re-skins the whole app.
- **Semantic colour roles.** Colour carries meaning: teal = action/primary, amber = evidence, red = challenge/gap, green = success. Keep roles stable even if hues change.
- **Evolving the design.** To change direction (new palette, dark mode, new component), update this doc + the tokens together in one PR so the system stays coherent. Significant shifts get an ADR.
- **Non-negotiables regardless of look:** accessibility (keyboard, focus, contrast, non-colour status signals), responsiveness (desktop-first, usable on mobile), and the calm "interview workspace" identity (not a generic SaaS dashboard or playful study app).

## Brand & direction

**Modern Academic Rigor** — a focused research-studio feel for university candidates doing high-stakes prep: calm, precise, slightly high-pressure, utility over "magical AI" tropes. This is the current direction and the starting point for future iteration; it is not frozen.

## Colour

Warm-academic foundation with semantic accents. Current token values (in `globals.css`):

- **Surfaces:** off-white background (`--color-background` `#f9f9ff`), white cards (`surface-container-lowest`), tonal grays for utility panels. Ink-navy text (`on-surface` `#141b2b`) rather than pure black.
- **Primary (action):** deep teal — `primary` `#005c55`, `primary-container` `#0f766e`, `on-primary` white.
- **Evidence (amber):** `evidence` `#f59e0b` / `on-evidence` `#92400e`, used for highlighting tested claims and transcript evidence.
- **Challenge / error (red):** `error` `#ba1a1a` and container, used for the live-challenge / gap states.
- **Success (green):** `success` `#0e8a16`.
- **Outlines:** 1px borders (`outline-variant`) instead of heavy shadows.

When the palette evolves, change the token values here + in `globals.css`; the semantic names stay.

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

- **Dark mode** — token set + `@theme` strategy (not yet built).
- Palette refresh / brand evolution (direction TBD).
- Component coverage: skeleton/loading states, toasts, modals/dialogs.
