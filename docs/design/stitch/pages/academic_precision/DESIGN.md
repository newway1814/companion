---
name: Academic Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3e4947'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#0047bf'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e5fe7'
  on-tertiary-container: '#e6e9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-md:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  section-title:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 320px
  gutter: 24px
  panel-gap: 1px
  unit-base: 8px
---

## Brand & Style

The design system is anchored in a philosophy of **Modern Academic Rigor**. It moves away from the ephemeral nature of "tech-bro" aesthetics, favoring a workspace that feels like a prestigious library or a focused research studio. The target audience is university students who require a high-fidelity environment for critical thinking and interview preparation.

The visual style is **Sophisticated Minimalist** with a **Tactile** edge. It utilizes a grounded, warm-toned foundation to reduce eye strain during long sessions while maintaining authority through precise typography and structured layouts. Emotional responses should range from calm focus to professional confidence. We avoid "magical" AI tropes in favor of utility and structural clarity.

## Colors

The palette is built on a "Warm Academic" foundation. 

- **Foundation:** The primary background uses a warm off-white (#F7F4EE) to differentiate from sterile consumer apps. Surfaces use pure white for active work areas and a light warm gray for utility panels.
- **Action & Intent:** The deep teal primary color conveys wisdom and stability. 
- **Functional Accents:** Amber is reserved specifically for "Evidence" highlighting, Green for "Success/Validation," and Red for "Critical Challenges" or "Gaps in Logic."
- **Typography:** We use a deep ink navy instead of pure black to maintain a softer, more premium contrast against the warm background.

## Typography

This design system uses a pairing of **IBM Plex Sans** for structural elements and **Inter** for reading-intensive content.

- **Headlines:** Use IBM Plex Sans with tighter letter-spacing for a modern, engineered feel. 
- **Body:** Inter provides maximum legibility at 15px and 16px. Line heights are generous (1.6x) to facilitate scanning and evidence-mapping.
- **Hierarchy:** Use `label-caps` for metadata (e.g., timestamps, categories) and `mono-label` for technical references or system-generated IDs.
- **Mobile Scale:** For displays, `display-lg` scales down to 32px on mobile devices to ensure readability without excessive wrapping.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model optimized for desktop productivity.

- **Split-Panel Layout:** The core workspace uses a three-pane layout: Navigation (Left), Main Workspace (Center), and Evidence/Notes (Right).
- **The 1px Gap:** Use 1px borders (#DDD6CC) between panels instead of wide gutters to maximize screen real estate and mimic a professional IDE or research tool.
- **Maximum Width:** Content within the central workspace is capped at 1440px to prevent excessive line lengths.
- **Rhythm:** All internal padding and margins follow an 8px modular scale.

## Elevation & Depth

In line with the academic aesthetic, this design system rejects heavy shadows. Depth is communicated via **Tonal Layering** and **Subtle Outlines**.

- **Level 0 (Background):** #F7F4EE.
- **Level 1 (Panels/Cards):** White (#FFFFFF) with a 1px solid border (#DDD6CC).
- **Level 2 (Modals/Popovers):** White with a 1px border and a very soft, 10% opacity neutral shadow (0px 4px 20px) to indicate interaction priority.
- **Active State:** Use a 2px teal border for focused inputs or selected cards rather than an elevation lift.

## Shapes

The design system uses a **Soft** shape language. 

- **Base Radius:** 4px for buttons, input fields, and chips. This provides a professional, "clipped" look that feels more precise than rounder consumer styles.
- **Large Radius:** 8px for cards and primary panels.
- **Interactive Elements:** Checkboxes use a 2px radius to maintain a sharp, institutional appearance.

## Components

### Buttons & Inputs
- **Primary Button:** Solid #0F766E with white text. No gradient. 4px radius.
- **Secondary Button:** White background with #DDD6CC border and #111827 text.
- **Input Fields:** #FFFFFF background, 1px #DDD6CC border. On focus, the border changes to #0F766E with a subtle 2px outer glow in the same color (20% opacity).

### Specialized Components
- **Evidence Chips:** Small, 4px rounded tags with a #F59E0B (Amber) background at 15% opacity and #92400E text. Used for tagging interview transcripts.
- **Structured Claim Cards:** White cards with an 8px radius and a vertical 4px accent bar on the left (Teal for verified, Amber for hypothesis).
- **Transcript List:** Tight vertical spacing with #5F6470 text and hover states that highlight the entire row in #ECE7DF.
- **Split-Panel Resizers:** Thin 1px lines that change to Teal (#0F766E) on hover to indicate interactivity.