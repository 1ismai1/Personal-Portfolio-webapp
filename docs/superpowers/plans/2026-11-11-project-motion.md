# Four Portfolio Transitions Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan.

**Goal:** Add four distinct, lightweight transitions requested by the user.
**Architecture:** An observed work heading plus server-rendered project entrance graphics and CSS. Native links retain navigation behavior.
**Tech Stack:** Existing Next.js, React, TypeScript, SVG, CSS; no dependencies.
**Spec:** ../specs/2026-11-11-project-motion-design.md

## Constraints and review focus

Keep existing content and tokens. Animate only transform/opacity, once. Reduced motion and no-JavaScript must leave content visible. Test native navigation, return/back behavior, narrow screens, viewport entry, and readable settled states.

## Task: Coordinated motion

- [x] Add components/home/WorkArrival.tsx to trigger a single signal sweep on viewport entry, cleaning up its observer and respecting reduced motion.
- [x] Wrap only the work heading in app/page.tsx; animate the adjacent lead card as part of the same sequence.
- [x] Add components/ProjectArrival.tsx with decorative waveform, board-layer, and packet graphics selected by slug.
- [x] Add a keyed project article and graphic in app/projects/[slug]/page.tsx; add scoped styles/keyframes in app/globals.css.
- [x] Update CLAUDE.md to document the requested four-motion exception.
- [x] Verify clicking all three cards, direct entry, back, reduced motion, no JavaScript, no overflow at 390/1440, and capture animation/settled screenshots. Run tsc and production build; compare home JavaScript.
- [x] Review the diff, fix material findings, and commit locally on redesign-fable.

## Execution notes

Continue in the existing user-preview branch so the user's local folder shows the result immediately. No separate checkout. Browser behavior checks are more useful here than snapshot tests of CSS declarations.

Navigation regression found during checks: native hero hash anchors created null history state, so Next's popstate handler ignored Back from a project. Reproduced on dev and production. Converted the three internal hero anchors to Next Link; the same browser test then passed. This is part of the requested hero-to-project journey.

Visual review reduced heading translation to 12px so titles stay within phone gutters. Fresh code review found that isIntersecting alone can trigger before the 30% threshold; the callback now also checks intersectionRatio. No other material findings.

Final verification: TypeScript and production build pass. scripts/check-motion.mjs passes against production at 390/1440, including all three card clicks and Back, direct visits, reduced motion, no-JavaScript home visibility, no horizontal overflow, and no page errors. Two visual review rounds cover animation and settled states. Home first-load JavaScript is 119 kB (previously 118 kB rounded); no dependencies added.
