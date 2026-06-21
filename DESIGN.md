---
name: Deeksha Dsouza Portfolio
description: A calm, plain-language portfolio for an operations and logistics professional.
colors:
  deep-flow: "#142d33"
  clear-surface: "#f8fbfb"
  sea-glass: "#e5f0f1"
  quiet-text: "#4d656a"
  soft-line: "#c9d6d9"
  human-coral: "#e3775f"
  coral-action: "#b5452c"
  dark-text: "#f6f8f9"
typography:
  display:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(3.2rem, 7.1vw, 5.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(2.15rem, 4vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
rounded:
  sm: "0.5rem"
  md: "0.875rem"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.deep-flow}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.2rem"
  button-light:
    backgroundColor: "{colors.dark-text}"
    textColor: "{colors.deep-flow}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.2rem"
---

# Design System: Deeksha Dsouza Portfolio

## 1. Overview

**Creative North Star: "Quiet Flow"**

The system should feel like a well-organized conversation: calm at first glance, clear as it unfolds, and confident without raising its voice. One precise route-line illustration expresses coordination and forward movement; everything else is carried by typography, plain language, and generous space.

It rejects generic resume styling, dense corporate layouts, and decoration without purpose. The interface stays useful before it becomes expressive, with one primary focus in each viewport and secondary details disclosed only when requested.

**Key Characteristics:**

- Soft, true-white surfaces with sea-glass sections rather than beige paper tones.
- One human coral accent used sparingly for emphasis and focus.
- A single humanist sans family with a large but controlled type scale.
- Flat composition, no decorative shadows, and no card grid scaffolding.
- Mobile layouts recompose into one clear reading path rather than simply shrinking.

## 2. Colors

Deep blue-green provides stability, pale sea-glass carries softness, and coral adds a small human note.

### Primary

- **Deep Flow:** the main text, dark contact surface, and primary button color.

### Secondary

- **Human Coral:** used for the hero introduction, outcome emphasis, route points, selection, and focus. It must remain rare.

### Neutral

- **Clear Surface:** the page background and light button text.
- **Sea Glass:** broad supporting sections and the portrait halo.
- **Quiet Text:** body copy and secondary navigation.
- **Soft Line:** dividers, timeline rails, and restrained link underlines.

**The Coral Rarity Rule.** Coral may emphasize a result or interaction, but it must never cover a large surface or become decorative filler.

## 3. Typography

**Display Font:** Hanken Grotesk (with Avenir Next and Segoe UI fallbacks)  
**Body Font:** Hanken Grotesk (with Avenir Next and Segoe UI fallbacks)

**Character:** Open, human, and precise. A single family prevents the page from drifting into editorial or resume-template styling.

### Hierarchy

- **Display** (600, fluid display token, 1.08): hero statement only; maximum 11 characters per line when composition permits.
- **Headline** (600, fluid headline token, 1.08): major section statements.
- **Title** (600, 1.45rem to 2.15rem): roles and project names.
- **Body** (400, 1.0625rem, 1.62): plain-language explanations capped near 60 characters per line.
- **Label** (500, 0.875rem, 1.45): dates, company notes, and navigation.

**The Plain Speech Rule.** If a sentence sounds like corporate copy, rewrite it before changing its typography.

## 4. Elevation

The system uses no shadows. Depth comes from broad tonal changes, spacing, the dark contact section, and one overlapping portrait composition.

**The Flat-by-Default Rule.** Borders and tonal surfaces may clarify grouping; decorative lift is prohibited.

## 5. Components

### Buttons

- **Shape:** gently squared (0.5rem radius), never pill-shaped.
- **Primary:** Deep Flow background, Clear Surface text, and compact 0.75rem by 1.2rem padding.
- **Hover / Focus:** a two-pixel upward response for fine pointers; a three-pixel coral focus ring for keyboard use.
- **Secondary:** text links use weight and a one-pixel underline rather than a container.

### Cards / Containers

- **Corner Style:** cards are not a default component.
- **Background:** group content with page surface changes and spacing.
- **Shadow Strategy:** no shadows.
- **Border:** one-pixel horizontal rules only when they make lists easier to scan.

### Navigation

Navigation is short, text-led, and visible. Desktop uses a horizontal line; mobile gives each link a 44px touch target and keeps the same information architecture.

### Flow Portrait

The signature hero component combines one real portrait, one sea-glass circle, and one continuous geometric route. It is illustrative evidence of the brand idea, not a decorative infographic.

### Disclosure

Education, training, and languages use native details and summary behavior. The closed state must remain understandable and keyboard accessible.

## 6. Do's and Don'ts

### Do:

- **Do** keep each viewport to seven or fewer broad attention objects.
- **Do** use plain language and show measurable evidence only when it explains real work.
- **Do** preserve 44px touch targets, visible focus states, reduced-motion support, and WCAG AA contrast.
- **Do** use spacing and horizontal rules before adding a container.
- **Do** keep the route illustration precise, geometric, and subordinate to the hero message.

### Don't:

- **Don't** use generic resume and CV templates or dense corporate profile pages.
- **Don't** use jargon-heavy business writing or duplicate headings with redundant introductions.
- **Don't** build an over-designed portfolio with repetitive card grids, nested cards, or decorative chrome.
- **Don't** use excessive animation, loud color, glassmorphism, gradient text, or decorative elements that compete with the content.
- **Don't** use beige or peach as the body background.
- **Don't** use hand-drawn or wobbly sketch illustrations; route artwork must stay geometrically controlled.
