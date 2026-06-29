# Adopt an in-repo design system as the UI source of truth

Supersedes [ADR 0002](0002-use-stitch-as-mvp-ui-source-of-truth.md).

Companion's UI source of truth moves from the Stitch-generated mockups to a living, in-repo design system at `docs/design/design-system.md`. Stitch served its purpose: it bootstrapped a coherent MVP UI quickly and stopped the team reviving the rejected Codex prototype. Now that the MVP has shipped, UI/UX is designed directly against the in-repo design system rather than translated screen-by-screen from static mockups.

## What this changes

- **The design system (`docs/design/design-system.md`) + the design tokens in `src/app/globals.css` are authoritative.** Visual and interaction decisions are made and recorded there. The "Modern Academic Rigor" direction and its semantic palette (teal action, amber evidence, red challenge) carry forward as the starting point and may evolve through normal design iteration.
- **New screens are designed, not transcribed.** UI work no longer needs to reference a Stitch page folder or justify deviations from a mockup. It should instead be consistent with the design system and reuse the shared tokens/components.
- **Stitch artifacts under `docs/design/stitch/` are retained as historical reference** (provenance for the existing screens) and are no longer authoritative. They must not be cited as the reason to keep or change a design.

## Why

- Stitch is a one-shot generator: it cannot evolve a design, maintain consistency as the product grows, or reason about new flows (e.g. dark mode, a coding-interview mode, a live voice/avatar interviewer). A living design system can.
- The app is already themed entirely through design tokens, so the source of truth is effectively the tokens + the document that governs them — not the static PNGs.
- Keeping a superseded mockup as "source of truth" creates friction: every new or refined screen would otherwise have to justify a "deviation."

## Consequences

- `docs/design/design-system.md` becomes the place to propose and record palette, typography, spacing, component, and theme (e.g. dark mode) decisions.
- Documents that previously named Stitch as the source of truth (`CONTEXT.md`, `docs/agents/domain.md`, the PRD, and the Stitch `README`/`IMPLEMENTATION_NOTES`) are repointed or marked historical.
- Workflow prompts/templates that assert "Stitch is the UI source of truth" should be updated to point at the design system.
- Accessibility, responsiveness, and the calm "interview workspace" identity remain hard requirements regardless of visual direction.
