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
  - Done: `415`, `403` for another `Origin` (own host or `x-forwarded-host`), control characters, timeout capped at 8 s, `413`. Checked on the Deploy Preview: a real form post is accepted and delivered.
- Separate restricted `BREVO_API_KEY` (transactional emails only) is set for the Deploy Preview context. Replace the full-access production key with a restricted one at release (Phase 11).

## Phase 9: Global interactions (done)

Intro build log, command palette, keyboard shortcuts, custom cursor.

- The intro plays on every load, is skipped with reduced motion and without JavaScript, and releases the first-paint choreography when it ends. "Replay intro" in the palette plays it again.
- The `G W` and `C` key hints on the hero buttons work now.

## Phase 10: Quality (done)

- Fidelity sweep against the prototype at 1440, 1000 and 390 px, both themes, both languages: hero, work, about and stack match to 1 px; remaining differences are approved deviations (footer wordmark and credit, privacy label wrap). Intro, cursor states, palette and contact outputs compared in detail.
- Accessibility: one `h1` per page, ordered headings, landmarks, named controls, visible focus on every Tab stop. Fixed: the empty hero tooltip had no name, and five controls had an `aria-label` that left out their visible text (WCAG 2.5.3). Focused contact inputs pass 1.4.11 (underline 8.1:1 dark, 5.8:1 light).
- Lighthouse 13.5.0 (local production build): performance 99 to 100 desktop and 90 to 92 mobile, best practices 100, accessibility 97 after the fixes, SEO 92 (canonical only flagged on localhost). The intro does not change LCP (3.4 s mobile with and without it).
- Metadata per language, canonical and `hreflang` alternates on `https://kamycoding.com` (a constant in `src/lib/site.ts`, `NEXT_PUBLIC_APP_URL` is no longer needed), Open Graph and Twitter tags, a generated Open Graph image per language, `sitemap.xml` (home only), `robots.txt` with the sitemap. Legal pages are `noindex, follow` and not in the sitemap. Manifest renamed to kamycoding.
- CSP enforced with `upgrade-insecure-requests` (ADR 0005). Kamyar checks the Report-Only preview console before pushing.
- ESLint stays on 9: `eslint-plugin-react` (up to `^9.7`), `eslint-plugin-jsx-a11y` and `eslint-plugin-import` (up to `^9`), all used by `eslint-config-next`, do not support ESLint 10 yet. All 9.x versions are marked unsupported. The remaining `pnpm audit` finding is the moderate minimatch issue in typescript-eslint (dev only); it needs ESLint 10 or an override.
- CI runner pinned to `ubuntu-24.04`. `.npmrc` removed (`shamefully-hoist` and `auto-install-peers` were not needed).
- Static 404 tried and reverted: with `dynamicParams = false` unknown URLs got the English root 404 without the shell. The `[...rest]` catch-all stays.
- Image preload hints removed (lazy decorative icons and portrait), which also removes the console warning on the legal pages. The prefetch of the home page still preloads its CSS there (one warning, Next.js behaviour).
- Contact function logs early rejections (405, 415, 403, 413) with status and reason.
- The intro no longer replays when the language is switched (the layout remounts without a page load).
- Netlify: functions run on `nodejs24.x` with `@netlify/plugin-nextjs` 5.16.6; Kamyar checks the build log lines for Node 24 and pnpm 12.18.0.

### Open after Phase 10

- Contrast: `--faint` and `--com` reach only 2.7 to 3.1:1 for small text in both themes (WCAG 1.4.3 needs 4.5:1); light `--str` is 4.1 to 4.7:1. These are prototype colors; changing them is a design decision.
- After a client-side switch to German, switching back to English leaves `/en` in the address bar (redirects to `/` on reload, canonical unaffected). From Phase 2d, in the language routing.
- HSTS `preload`: not now (decided in Phase 10); revisit after the Phase 11 check of the HSTS header on kamycoding.com.
- Real phones and the secret scanning extras: Kamyar.

## Phase 10b: Fixes before release (done)

- Language switch keeps the reading position and English always uses `/`; one switch for buttons, palette, `L` and the terminal.
- Terminal reprints its intro in the new language; hero status row shows "Open to work" and the Cologne time only.
- Reviewers link to their LinkedIn profiles; `downlevelIteration` removed from `tsconfig.json`.
- Contrast: `--faint` and `--com` (both themes) and light `--str` reach 4.5:1 (closes the contrast item above).
- README rewritten for v2 with screenshots in `docs/media/`.
- The `/en` URL item above is fixed.

## Phase 11: Release

Update CHANGELOG, merge to `main` via pull request, tag `v2.0.0`, GitHub release.

- Done: privacy policy "Last updated" set to 9 November 2026 / 9. November 2026; the legal notice keeps 10 August 2026.
- Unlock auto publishing in Netlify (the v1 production deploy is locked) right after merging v2 into main.
- Turn Dependabot security updates back on.
- Replace the full-access production `BREVO_API_KEY` with a restricted key (transactional emails only).
- After the release, check that the `Canonical` and `Policy` URLs in `security.txt` resolve.
- After the release, check which HSTS header kamycoding.com sends (on netlify.app, Netlify's own header wins) and decide whether to set it explicitly in `netlify.toml`.
- Note: the required status check on `main` is tied to the CI job name "Lint, types, test, build". Renaming the job blocks all merges.

## Phase 12: GitHub contribution heatmap (v2.1.0, done)

The stack heatmap shows the real GitHub contributions of kamycoding instead of the static v1 commits (ADR 0006).

- Fetched at build time from the GitHub GraphQL API: the last 52 weeks (17 weeks until v2.2.0), GitHub's own levels, "contributions" / "Beiträge".
- `src/content/contributions.json` is the committed snapshot and the fallback; the build never fails on the API.
- Token `GITHUB_CONTRIBUTIONS_TOKEN` in Netlify as a secret for Production only (default scopes on the free plan); previews and Dependabot pull requests use the snapshot.
- Daily rebuild through `.github/workflows/refresh-contributions.yml` and a Netlify build hook (`NETLIFY_BUILD_HOOK_URL` secret).
- The about fact "168 commits since July" stays unchanged.
- Maintenance: renew the token before it expires (at most one year); refresh the committed snapshot now and then with `pnpm contributions:update`.

## Journal: Phase 1

Branch: `feat/blog`. Each step is reviewed separately. Kamyar commits and pushes.

- Step 1a (done): MDX modules through `@next/mdx`, local Shiki plugin through an absolute path, validated exported metadata, empty explicit post registry and gitignored local drafts (ADR 0007).
- Step 1b (done): Journal indexes and article routes, missing-translation notices, basic editor tabs and breadcrumbs, top-bar/footer navigation, journal locale switching and bilingual copy. Empty indexes use `noindex, follow` until a post is published. Both locales of every published slug are prebuilt. Unknown slugs call `notFound()` immediately using the existing localized 404 pattern with default `dynamicParams`; they never render an article. Journal-only proxy handling suppresses automatic alternate headers while the pages supply accurate HTML alternates. English locale switches use `/blog/...`, without `/en`.
- Step 1c (done): reading styles, code blocks from fenced Markdown (filename, copy, highlighted lines, diffs, AA token colours in all four themes), build-time heading IDs with German transliteration and an `outline` export, Outline scroll-spy with a mobile Contents control, article progress in the status bar, and index links that point other-language posts at their published version.
- Step 1d (done): Term (native popover), Gloss (authored word-group alignment), Dialog (Show English toggle), Quiz, Callout, TLDR, Takeaways and Figure. Validated per-slug `learning.json` referenced by id from MDX; unknown ids fail the build. Audio slots are left for step 1e.
- Step 1e (done): `pnpm audio` dry runs and Kamyar-run `--generate` with ElevenLabs (Starter plan, two Voice Library voices), hashed clips under `public/blog-audio/`, validated `audio.json` manifests, timed Gloss highlighting, local German Web Speech fallback and an unavailable state. Model chosen after a sample comparison: `eleven_v4` for both voices, with character timing returned (about 38 credits for 94 characters on Starter).
- Step 1f (done): metadata length checks, sitemap with content-based `lastmod`, RSS per language with autodiscovery, a blueprint Open Graph image per translation, JSON-LD (BlogPosting, BreadcrumbList, Person), author box, privacy policy section 11 on journal audio with the corrected theme paragraph, and the README authoring guide. DefinedTerm moves to Phase 2.
- Step 1g (done, v2.3.0): the first English article, "German for Developers: What People Say in Dailies and Calls", registered with its `learning.json` and an empty `audio.json` that `pnpm audio --generate` fills. Post metadata takes an optional `tldr` and an optional `preview` (up to two hook lines). The homepage gets a `blog/` section after the stack as VS Code's "Open editors" (one editor window per post in a scrolling row, quick-open filter and category chips from three posts on, hidden while nothing is published), the terminal gets `ls blog`, `open <slug>` and `cat blog/<slug>`, and the palette lists the journal and every post. The registry test now checks the registered posts against `content/posts/`. After review: Term opens on hover too, journal pages get a reading cursor and quieter rulers, the intro hides its text instantly when it ends (Lighthouse accessibility 100 on every page), and the 29 article clips are generated.
- Step 1h (done, v2.3.0): the second article, "The JavaScript Event Loop: Predict the Output", in English and German, with four interactive components (puzzle, stepper, async timeline, main thread demo). Narration through `learning.json`, a `narration` audio kind with a narrator per language and a reusable "Listen to this article" player that marks the playing section in the Outline.
- Before the release: Kamyar runs `pnpm audio javascript-event-loop-explained --generate` and listens to the narration, then checks the privacy policy "Last updated" date on release day.

Phase 2 includes the minimap, CodeTabs, BeforeAfter, Steps, Glossary, vocabulary basket, full-text search, Atom, revision history, explained glossary pages and series pages.

## Answered questions

- Project durations and years (Join 5 weeks, Designer portfolio 4 months, El Pollo Loco 3 weeks, all 2026): confirmed as in the prototype.
- Reviews and facts in the about section: real and confirmed.
- Developer Akademie start date: 31 March 2026, intensive course "Softwareentwickler, Schwerpunkt Web-Anwendungen". The prototype shows no start date, so the git log keeps "ongoing" / "laufend"; use "since March 2026" / "seit März 2026" only where a start date is shown.
- Heatmap note: "Jul to Sep 2026" / "Jul bis Sep 2026" is correct (v1 history starts 23 Jul); the "Jun" in the prototype was a mistake.
