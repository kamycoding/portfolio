# ADR 0003: Replace the Zolt UI with a custom editor design

- Status: Accepted
- Date: 2026-11-08
- Partly supersedes: ADR 0001 (the stack stays, the template UI goes)

## Context

ADR 0001 started v2 from the Zolt template. After reviewing it, Kamyar wanted a site with a clear concept of its own instead of a personalized template. A new design was prototyped and approved: the whole site is a code editor, each section is a file, with a terminal, a command palette, line-drawing project covers and a cat.

## Options

1. Keep Zolt and restyle it.
2. Keep the Next.js setup from Phase 1 and rebuild the UI from the approved prototype.
3. Start a new repository.

## Decision

Option 2. The Next.js, TypeScript, Tailwind, pnpm and Netlify setup from Phase 1 stays. The Zolt sections and components are removed and replaced by components built from `docs/design/DESIGN.md`. The prototype is kept in `docs/design/prototype/` as the visual reference.

## Consequences

- The UI is our own, so the Zolt MIT notice is only needed for files that are still derived from Zolt. Remove the footer credit once nothing from Zolt is left, keep `LICENSE.md` until then.
- The React Bits lanyard (Commons Clause) is no longer used, so that license question goes away.
- More components to build by hand, but each one is small and specific.
- Animations follow `prefers-reduced-motion` from the start.
