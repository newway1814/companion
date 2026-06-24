# Use Stitch as MVP UI source of truth

Companion's MVP UI will use the Stitch-generated design under `docs/design/stitch/pages/` as the source of truth because it matches the documented product direction for a desktop-first, speech-first interview workspace. The previous Codex-generated prototype UI was rejected and must not become the production baseline; Codex should implement Stitch faithfully rather than redesigning the interface.

Stitch is authoritative for UI composition, hierarchy, component treatment, and interaction direction. Product behavior and MVP scope remain governed by `CONTEXT.md`, ADRs, and the PRD when static mock content conflicts with them.

The most important Stitch pages are `main_interview_room`, `live_challenge_moment`, and `final_coaching_report`, because they define the core MVP loop: practice, adaptive challenge, and coaching feedback. Every future UI issue must reference the relevant Stitch page folder, and any deviation from Stitch must be justified by accessibility, responsiveness, or technical feasibility.
