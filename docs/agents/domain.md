# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repo root, if it exists.
- `docs/adr/`, especially ADRs that touch the area about to be changed.

If these files do not exist yet, proceed silently. The `/domain-modeling` skill can create or sharpen them when terms or decisions are resolved.

## File structure

This is a single-context repo:

```text
/
+-- CONTEXT.md
+-- docs/adr/
+-- src/
```

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in `CONTEXT.md`. If the concept is missing, note it as a candidate for `/domain-modeling`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding the decision.
