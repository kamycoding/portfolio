# ADR 0001: Move the portfolio from Angular to Next.js

- Status: Accepted
- Date: 2026-11-08

## Context

The v1 portfolio is an Angular app. The design felt generic and the project images on the landing page did not look professional. Kamyar wanted a distinctive v2 and his current focus is React and Next.js. Building a strong design from zero would take weeks.

## Options

1. Redesign inside the Angular app.
2. Build v2 from zero in Next.js.
3. Start from the free Zolt template (Next.js, MIT) and personalize it fully.

## Decision

Option 3. Zolt gives a polished, interactive base (3D ID card, case study pages, motion) and is already React with TypeScript. All content, images and sections are replaced with Kamyar's real work. Pricing and booking sections from the template are removed.

## Consequences

- v1 stays available at tag `v1.0.0` and can be restored at any time.
- The stack now matches the jobs Kamyar applies for (React, Next.js, TypeScript).
- The MIT notice of Zolt must stay in the repo and in the footer.
- Translations from v1 must be moved to next-intl (Phase 4).
