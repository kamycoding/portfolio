# Portfolio v2 roadmap

Branch: `redesign/v2`. One phase, one commit. Kamyar commits and pushes.
Design reference: `docs/design/DESIGN.md` and `docs/design/prototype/`.

## Phase 1: Bring in the v2 source (done)
Next.js, pnpm, Netlify config.

## Phase 2a: Foundation (done)
- Add the design spec and prototype to `docs/design/` (reference only, not built).
- ADR 0003: replace the Zolt UI with the custom editor design.
- Remove the Zolt sections and components that the new design does not use.
- Tokens in `globals.css` (dark and light), Geist fonts, theme switching without a flash.
- next-intl with `en` and `de` from the start, so every later phase ships both languages (ADR 0004).
- Commit: `feat: add design foundation`

## Phase 2b: Repo hygiene (done)
- `LICENSE` in two parts: code under MIT, content (texts, photos, design, illustrations, the cat) all rights reserved. Keep `LICENSE.md` from Zolt (ADR 0003).
- Complete `README.md`, `CHANGELOG.md` (Keep a Changelog, 1.0.0 and Unreleased), `.nvmrc` with 24.
- Vitest with `pnpm test` (`--passWithNoTests`), the contact function tests come back in Phase 8.
- GitHub Actions CI: frozen install, lint, check-types, test, build. Dependabot for npm and actions.
- `SECURITY.md`, `public/.well-known/security.txt`, PR and issue templates, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS`.
- commitlint (Conventional Commits) and a pre-commit hook with husky and lint-staged.
- Commit: `chore: add repo hygiene`

## Phase 2c: Security baseline
- Upgrade `next` and `eslint-config-next` to 16.4.2 and `zod` to 4.6.7, refresh stale transitive versions in the lockfile (done: `dd21ed9`).
- Security headers in `next.config.ts`, production only: CSP as Report-Only, HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP (ADR 0005).
- `poweredByHeader: false`, `Secure` flag on the `NEXT_LOCALE` cookie.
- `.gitignore` covers every `.env*` file (except `.env.example`) and `.netlify/`.
- `security.txt` expires 2027-10-31, lists GitHub private reporting; `SECURITY.md` matches.
- ESLint rule `react/no-danger` as an error.

## Phase 2d: Layout shell (done)
- Top bar with file tabs, rulers, status bar, breadcrumbs, footer.
- `Ctrl K` button waits for Phase 9, `cat:` in the status bar for Phase 3. The footer keeps the Zolt credit while Zolt-derived config files remain (ADR 0003).
- Commit: `feat: add layout shell`

## Phase 3: Hero (done)
Editor panel with tabs and hover cards, terminal, typed headline, status row, dot grid, ticker, the cat component.
- The terminal renders input and output as text only, never as HTML (ADR 0005, `react/no-danger`).
- The `G W` and `C` key hints on the hero buttons work once the shortcuts arrive in Phase 9. Typing and fade-ins start after the intro then.

## Phase 4: Work (done)
`ls -la` list, pointer preview, project drawer, line-drawing covers as SVG components.

## Phase 5: About (done)
Markdown text, facts, ASCII portrait with lens, git log experience, reviews.

## Phase 6: Stack (done)
JSON tree, commit heatmap, services.
- Heatmap data comes from `git log v1.0.0` (168 commits, 23 Jul to 18 Sep 2026); the stats are computed from it.

## Phase 7: Legal pages (done)
`/legal-notice` and `/privacy-policy`, text ported from v1 as it is, in the new design. Privacy policy updated for theme and language storage.
- Section 10 of the privacy policy is new: it describes the `NEXT_LOCALE` cookie and the `theme` key in Local Storage instead of v1's `kamycoding.language` key. Kamyar reviews the wording.

## Phase 8: Contact form (done)
- Shared schema in `src/lib/contact/contact-schema.ts` (`zod/mini`, about 7 KB gzipped in the browser), used by the form and the Netlify function.
- Form as `sendMessage({ ... })`, TypeScript-style errors, honeypot, privacy checkbox ("I have read the privacy policy").
- Posts to `/api/contact` (existing Netlify function with Brevo and rate limit).
- `.env.example`, vitest back on (the function tests run with `pnpm test`).
- No netlify-cli for now (decided in Phase 8): the function is covered by Vitest, the form was checked with mocked responses, the real end-to-end test runs on a Deploy Preview. Add a `dev:netlify` script later only if needed.
- `server/src/validators/contact.validator.ts` is no longer used (the function imports the shared schema). Kamyar deletes the `server/` folder.
- The output panel renders text only, never HTML (ADR 0005).
- Security review findings for the function:
  - Accept only `Content-Type: application/json` (`415` otherwise), optionally check `Origin`, so other sites cannot send cross-site form posts.
  - Reject control characters (line breaks) in `name`.
  - Set `BREVO_REQUEST_TIMEOUT_MS` below the Netlify function time limit of the plan.
  - Reject bodies above about 10 KB with `413` before parsing.
  - Done: `415`, `403` for another `Origin` (own host or `x-forwarded-host`), control characters, timeout capped at 8 s, `413`. Check on the Deploy Preview that a real form post is not answered with `403`.
- Separate restricted `BREVO_API_KEY` (transactional emails only) is set for the Deploy Preview context. Replace the full-access production key with a restricted one at release (Phase 11).

## Phase 9: Global interactions (done)
Intro build log, command palette, keyboard shortcuts, custom cursor.
- The intro plays on every load, is skipped with reduced motion and without JavaScript, and releases the first-paint choreography when it ends. "Replay intro" in the palette plays it again.
- The `G W` and `C` key hints on the hero buttons work now.

## Phase 10: Quality
- Accessibility pass in both themes and both languages, reduced motion.
- Full visual sweep against the prototype: Phases 8 and 9 were compared in detail only for the main new elements.
- On the legal pages, the prefetch of the home page adds image preload hints for the ticker icons that are not used (console warning). Check `prefetch` on the shell links or the ticker images.
- Lighthouse, metadata, Open Graph image, sitemap, `NEXT_PUBLIC_APP_URL` (currently undefined, canonical URLs break).
- Netlify Deploy Preview of the branch, test on real phones.
- Upgrade ESLint 9 to 10 (9.39.2 is deprecated), check that `eslint-config-next` and the plugins support it.
- minimatch 10.x moderate via typescript-eslint, clears with the ESLint 10 / typescript-eslint upgrade; check pnpm audit then.
- Enforce the CSP: check a Deploy Preview with `curl -I` and the browser console, then switch from Report-Only and add `upgrade-insecure-requests` (ADR 0005).
- Netlify runtime switch to Next.js: done early in the UI, before the first v2 Deploy Preview (`netlify.toml` sets `publish = ".next"`). The Deploy Preview log must show Node 24 and pnpm 12.18.0; fallback: `PNPM_VERSION=12.18.0` in the UI.
- `HUSKY = "0"` for Netlify builds (done in 2c, `netlify.toml`).
- CI: decide whether to pin `ubuntu-24.04` or keep `ubuntu-latest` (it moves to Ubuntu 26).
- CodeQL default setup runs with full-length SHA pinning required (verified on Deploy Preview PR #54).
- Serve unknown URLs from a static 404 instead of the dynamic `[...rest]` catch-all, which runs a function per request.
- Review `shamefully-hoist=true` in `.npmrc` (a Zolt default) and remove it if nothing depends on it.
- Decide on HSTS `preload` (all subdomains are HTTPS: www, join, elpolloloco).
- Optional: secret scanning for non-provider patterns and validity checks.

## Phase 11: Release
Update CHANGELOG, merge to `main` via pull request, tag `v2.0.0`, GitHub release.
- Set the "Last updated" date of the privacy policy (still 10 August 2026 from v1) to the date the new section 10 goes live; Kamyar gives the date. The legal notice keeps its date.
- Unlock auto publishing in Netlify (the v1 production deploy is locked) right after merging v2 into main.
- Turn Dependabot security updates back on.
- Replace the full-access production `BREVO_API_KEY` with a restricted key (transactional emails only).
- After the release, check that the `Canonical` and `Policy` URLs in `security.txt` resolve.
- After the release, check which HSTS header kamycoding.com sends (on netlify.app, Netlify's own header wins) and decide whether to set it explicitly in `netlify.toml`.
- Note: the required status check on `main` is tied to the CI job name "Lint, types, test, build". Renaming the job blocks all merges.

## Answered questions
- Project durations and years (Join 5 weeks, Designer portfolio 4 months, El Pollo Loco 3 weeks, all 2026): confirmed as in the prototype.
- Reviews and facts in the about section: real and confirmed.
- Developer Akademie start date: 31 March 2026, intensive course "Softwareentwickler, Schwerpunkt Web-Anwendungen". The prototype shows no start date, so the git log keeps "ongoing" / "laufend"; use "since March 2026" / "seit März 2026" only where a start date is shown.
- Heatmap note: "Jul to Sep 2026" / "Jul bis Sep 2026" is correct (v1 history starts 23 Jul); the "Jun" in the prototype was a mistake.
