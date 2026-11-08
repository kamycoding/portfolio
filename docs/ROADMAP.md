# Portfolio v2 roadmap

Branch: `redesign/v2`. One phase, one commit. Kamyar commits and pushes.
Design reference: `docs/design/DESIGN.md` and `docs/design/prototype/`.

## Phase 1: Bring in the v2 source (done)
Next.js, pnpm, Netlify config.

## Phase 2a: Foundation
- Add the design spec and prototype to `docs/design/` (reference only, not built).
- ADR 0003: replace the Zolt UI with the custom editor design.
- Remove the Zolt sections and components that the new design does not use.
- Tokens in `globals.css` (dark and light), Geist fonts, theme switching without a flash.
- next-intl with `en` and `de` from the start, so every later phase ships both languages (ADR 0004).
- Commit: `feat: add design foundation`

## Phase 2b: Layout shell
- Top bar with file tabs, rulers, status bar, breadcrumbs, footer.
- Commit: `feat: add layout shell`

## Phase 3: Hero
Editor panel with tabs and hover cards, terminal, typed headline, status row, dot grid, ticker, the cat component.

## Phase 4: Work
`ls -la` list, pointer preview, project drawer, line-drawing covers as SVG components.

## Phase 5: About
Markdown text, facts, ASCII portrait with lens, git log experience, reviews.

## Phase 6: Stack
JSON tree, commit heatmap, services.

## Phase 7: Legal pages
`/legal-notice` and `/privacy-policy`, text ported from v1 as it is, in the new design. Privacy policy updated for theme and language storage.

## Phase 8: Contact form
- Shared zod schema in `src/lib/contact/contact-schema.ts`, used by the form and the Netlify function.
- Form as `sendMessage({ ... })`, TypeScript-style errors, honeypot, privacy checkbox ("I have read the privacy policy").
- Posts to `/api/contact` (existing Netlify function with Brevo and rate limit).
- `.env.example`, `dev:netlify` script with a pinned netlify-cli, vitest back on.

## Phase 9: Global interactions
Intro build log, command palette, keyboard shortcuts, custom cursor.

## Phase 10: Quality
- Accessibility pass in both themes and both languages, reduced motion.
- Lighthouse, metadata, Open Graph image, sitemap, `NEXT_PUBLIC_APP_URL` (currently undefined, canonical URLs break).
- Netlify Deploy Preview of the branch, test on real phones.

## Phase 11: Release
Update CHANGELOG, merge to `main` via pull request, tag `v2.0.0`, GitHub release.

## Open questions for Kamyar
- Join: really 5 weeks? Designer portfolio: 4 months? El Pollo Loco: 3 weeks? All years 2026?
- Developer Akademie start date.
