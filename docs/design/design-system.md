# Companion Design System

> **Superseded by the root [`DESIGN.md`](../../DESIGN.md) + [`PRODUCT.md`](../../PRODUCT.md), managed via the [impeccable](https://github.com/pbakaus/impeccable) skill ([ADR 0004](../adr/0004-adopt-impeccable-design-md-as-ui-source-of-truth.md), superseding [ADR 0003](../adr/0003-adopt-in-repo-design-system.md)).** This file is retained only as a pointer so historical links do not dangle. Do not treat it as authoritative and do not design against it.

The UI/UX source of truth is now:

- **[`DESIGN.md`](../../DESIGN.md)** — the visual system (colour, typography, elevation, components, do's and don'ts), anchored to the North Star **"The Cockpit at Night."**
- **[`PRODUCT.md`](../../PRODUCT.md)** — strategic/brand context (register, users, brand personality, anti-references, design principles).
- **[`src/app/globals.css`](../../src/app/globals.css)** — the normative design tokens both documents describe.

Design UI with the impeccable skill: run `/impeccable <command>` (`critique`, `craft`, `shape`, `polish`, `live`, …) against `DESIGN.md`, and reuse the shared primitives in `src/components/ui/`.

The dark "Focused Cockpit" direction and its semantic colour roles (teal = action, amber = evidence, red = challenge, green = success) carry forward unchanged into `DESIGN.md`. The Stitch mockups under `docs/design/stitch/` remain historical reference only.
