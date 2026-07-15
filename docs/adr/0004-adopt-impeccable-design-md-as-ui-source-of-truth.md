# Adopt impeccable-managed DESIGN.md as the UI source of truth

Supersedes [ADR 0003](0003-adopt-in-repo-design-system.md).

Companion's UI/UX source of truth moves from `docs/design/design-system.md` to the root **`DESIGN.md`** (visual system) and **`PRODUCT.md`** (strategic/brand context), managed through the [impeccable](https://github.com/pbakaus/impeccable) design skill. `docs/design/design-system.md` served its purpose — it replaced the Stitch mockups with a living in-repo system. We now design and iterate UI directly with impeccable, whose `DESIGN.md` format is machine-readable, tool-validated, and drives the skill's critique/craft/polish/live workflow.

## What this changes

- **`DESIGN.md` + `PRODUCT.md` (root) + the design tokens in `src/app/globals.css` are authoritative.** Visual and interaction decisions are recorded in `DESIGN.md` (six-section spec + named rules); strategic/brand decisions in `PRODUCT.md`. `globals.css` remains the normative token layer both documents describe — a palette change is still a token change.
- **UI is designed with impeccable.** New or refined screens are built via `/impeccable <command>` (`critique`, `craft`, `shape`, `polish`, …) against `DESIGN.md`, reusing the shared tokens/components in `src/components/ui/`.
- **The visual direction is unchanged.** The dark "Focused Cockpit" identity carries forward as impeccable's North Star **"The Cockpit at Night"**: near-black canvas, electric-teal action, amber evidence, red challenge, green success; 1px hairlines, no shadows. The semantic colour roles are preserved.
- **`docs/design/design-system.md` becomes a pointer stub** to `DESIGN.md`, retained so historical links (including ADR 0003) do not dangle. The Stitch artifacts under `docs/design/stitch/` remain historical reference only, as before.

## Why

- impeccable's `DESIGN.md`/`PRODUCT.md` are a machine-readable, validated format with a dedicated design workflow (scored critiques, end-to-end craft, in-browser variant iteration) that a prose-only design doc cannot provide.
- Keeping two authoritative design docs (`design-system.md` and `DESIGN.md`) invites drift. Consolidating on the impeccable-managed pair removes that ambiguity.
- The app is themed entirely through design tokens, so the practical source of truth is the tokens plus the document that governs them — now `DESIGN.md`.

## Consequences

- `DESIGN.md` is the place to propose and record palette, typography, spacing, component, and theme decisions; `PRODUCT.md` holds register, users, brand personality, anti-references, and design principles.
- Documents that named `docs/design/design-system.md` as the source of truth (`CONTEXT.md`, `docs/agents/domain.md`, `src/app/globals.css`, the PRD) are repointed to `DESIGN.md`.
- Accessibility, responsiveness, and the calm "interview workspace" identity remain hard requirements regardless of tooling.
