# Separate the marketing and product visual languages

Companion's public marketing landing page may use a cinematic visual language that is distinct from the authenticated product's "Cockpit at Night" design system.

## Context

ADR 0004 made `DESIGN.md`, `PRODUCT.md`, and the shared application tokens authoritative for product UI. That system is intentionally restrained and instrument-like because users operate it during focused practice sessions. The public landing page has a different job: demonstrate adaptive follow-up pressure quickly enough for an unfamiliar visitor to understand and remember the product.

A single visual system could preserve consistency, but it would also force an acquisition story into workspace patterns that were designed for sustained use. A full visual reset across the product would create unnecessary risk and distract from the practice-session experience.

## Decision

- The authenticated dashboard, guided setup, interview room, and performance report continue to follow `DESIGN.md`, `PRODUCT.md`, and the shared application tokens.
- The public marketing landing page is a separate visual context. It may use cinematic 3D storytelling, a marketing-specific palette, and lower information density.
- The landing page must preserve Companion's product positioning, safety boundaries, privacy promises, and demanding-but-fair voice.
- Marketing-specific styles and animation code remain isolated from authenticated product components and tokens.
- This exception does not authorize redesigning authenticated product surfaces.

## Consequences

- A visitor may see a deliberate visual transition after authentication.
- Shared brand recognition must come from the Companion name, product promise, terminology, and interaction narrative rather than identical surface styling.
- Landing-page accessibility, performance, reduced-motion behavior, and static fallbacks become explicit release requirements because its main visual layer is optional WebGL.
- Future contributors must choose whether work belongs to the marketing context or the authenticated product context before applying visual rules.
