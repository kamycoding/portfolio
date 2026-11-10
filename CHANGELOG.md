# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Bilingual Journal indexes at `/blog` and `/de/blog`, with an honest empty state and `noindex, follow` until posts are published.
- Static article and missing-translation routes with editor tabs, breadcrumbs, top-bar/footer navigation and localized 404 handling for unknown slugs.
- Journal-only proxy handling and publication-aware language alternates. Journal language switching keeps English URLs free of the `/en` prefix.
- Journal reading styles: Geist Sans prose at about 70ch, code blocks with filename, copy button, highlighted lines and diffs in all four themes, an Outline with scroll-spy (a Contents control on small screens) and reading progress in the status bar.
- Heading IDs are generated at build time, transliterate German umlauts and ß, keep explicit `<h2 id="...">` anchors and avoid duplicates.
- Journal indexes link a post that exists only in the other language directly to its published version.

## [2.2.0] - 2026-11-09

### Changed

- The stack section is two blocks: the stack as a VS Code style explorer (folders per group, technologies as files, real names on hover and focus) and a full-width GitHub contributions grid for the last 52 weeks with a reveal wave, a pulse on today and a stats line.
- The footer closes with a large "kamycoding" line drawing that draws itself once and the cat lying on its "m". The bottom bar keeps only the copyright and the template credit.
- Reviews are shown as GitHub-style pull request reviews with line-drawn avatars, an approval summary and the quotes as review comments.
- The hero shows only the name and role. The editor can be slid between a live-measured blueprint and the build (the entrance plays it after the intro), and the terminal is rebuilt with a modern prompt, ghost suggestions and real commands such as `ls projects`, `git log` and `blueprint`.
- Colors follow VS Code: the dark theme uses Dark Modern, and a Color Theme picker (`T`, the top bar or the status bar) switches between Dark Modern, Light Modern, Monokai and Solarized Dark with live preview. The default follows the system, and every theme meets WCAG AA for text.
- The top bar and the intro show the version from `package.json` (`v2.1`, `2.1.0`) instead of a hardcoded `2.0`, so they follow every release.
- `@types/node` follows the Node 24 runtime (`24.19.2`, was `22.19.3`).
- Dependabot no longer proposes major updates of `@types/node`; they are raised together with the Node version.

## [2.1.0] - 2026-11-09

### Changed

- The stack heatmap shows the real GitHub contributions of kamycoding for the last 17 weeks, with GitHub's own levels, instead of the static v1 commits. The data is fetched at build time and refreshed daily; a committed snapshot is the fallback (ADR 0006).

## [2.0.0] - 2026-11-09

A full rebuild of kamycoding.com in Next.js. The site is designed as a code editor: each section is a file, with a terminal, a command palette, line-drawing project covers and a cat. It ships in English and German, in a dark and a light theme, as static pages on Netlify. The contact form stays a Netlify Function with Brevo, now with a shared schema, stricter request checks and privacy-safe logging.

### Added

- Next.js 16 with React 19, TypeScript and Tailwind CSS v4, built with pnpm.
- Custom editor design: design spec and approved prototype in `docs/design/` (ADR 0003).
- Design tokens for the dark and light theme, Geist fonts, theme switching without a flash.
- English and German with next-intl: English at `/`, German at `/de`, browser language detection (ADR 0004).
- Localized 404 page.
- Layout shell: top bar with file tabs as navigation, scroll progress, theme toggle and language switch; rulers with crosshair (desktop); status bar with branch, current file, line and Cologne time; sticky breadcrumbs per section; footer.
- Hero (`index.tsx`): typed headline, CTAs, now row with Cologne time, editor with `kamyar.ts` and `types.ts` tabs and TypeScript-style hover cards, terminal with 13 commands, history and Tab completion, dot grid with pointer spotlight, editor tilt, tech ticker.
- The cat: sleeps, purrs on a long hover, wakes on click with eyes that follow the pointer; its state shows in the status bar.
- Work (`work.tsx`): `ls -la projects/` list with keyboard navigation, a cover preview that trails the pointer, and a README drawer per project with focus trap, arrow-key stepping and links; line-drawing covers as SVG components.
- About (`about.md`): Markdown-style text with counting facts, ASCII portrait with a lens that reveals the photo, experience as a `git log --graph`, reviews as pull request approvals.
- Stack (`stack.json`): foldable JSON tree with icons, a commit heatmap of the v1 history (168 commits) with tooltips and keyboard navigation, services as functions.
- Legal notice and privacy policy at `/legal-notice` and `/privacy-policy`, in English and German, shown as Markdown files in the editor shell.
- Contact (`contact.ts`): direct links and a `sendMessage({ ... })` form with TypeScript-style errors, a honeypot, a privacy checkbox, `Ctrl`/`⌘ Enter` to send and an output panel; a second cat sits on the form.
- Shared contact schema for the form and the Netlify function; the function tests run again with Vitest.
- Intro build log on every load, command palette (`Ctrl K` / `⌘ K`), keyboard shortcuts (`G` plus a letter, `C`, `T`, `L`, `M`, `?`) and a custom cursor with action labels.
- Metadata per language with canonical and language alternates, Open Graph and Twitter tags, a generated Open Graph image per language, a sitemap, and `noindex` for the legal pages.
- The contact function logs every request in one line without personal data, including rejected requests.
- Repository hygiene: GitHub Actions CI, Dependabot, Vitest, commitlint and pre-commit hooks, security policy, `security.txt`, issue and pull request templates, contributing guide and code of conduct.
- Reviewer names link to their LinkedIn profiles.
- README for v2 with screenshots, architecture diagram and setup guide.

### Changed

- The license now has two parts: source code under MIT, content all rights reserved.
- Privacy policy section 10 describes the language cookie and the theme setting of v2 instead of the v1 language key in Local Storage.
- Contact function: accepts only JSON (`415`), refuses other origins (`403`) and bodies above 10 KB (`413`), rejects control characters in the name, and caps the Brevo timeout at 8 seconds.
- Accessibility: visible labels are part of the accessible names of the brand link, palette button, cats and status bar buttons; the hero tooltip only has its role while it has content.
- Decorative icons and the portrait load lazily, so the page no longer preloads 21 images.
- The intro plays once per page load and no longer replays after a language switch.
- CI runs on `ubuntu-24.04`; the `.npmrc` with `shamefully-hoist` is removed.
- A language switch keeps the reading position (same section and offset, the top stays the top), and English always uses `/` (no `/en`).
- The terminal reprints its intro in the new language after a switch and keeps the visitor's own commands.
- The hero status row shows "Open to work" and the Cologne time only.
- Small text colors (`--faint`, `--com`, light `--str`) reach WCAG AA contrast (4.5:1) in both themes.
- Privacy policy updated on 9 November 2026.

### Security

- Upgraded Next.js to 16.4.2 and zod to 4.6.7, refreshed stale transitive dependencies. `pnpm audit` reports no known vulnerabilities in production dependencies.
- Security headers for production builds: Content Security Policy (enforced, with `upgrade-insecure-requests`), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy` (ADR 0005).
- Removed the `X-Powered-By` header and set the `Secure` flag on the language cookie.
- `.gitignore` covers every environment file and the Netlify CLI folder.
- `security.txt` and the security policy list GitHub private vulnerability reporting next to email.
- ESLint forbids `dangerouslySetInnerHTML`.

### Removed

- The Angular application (preserved at tag `v1.0.0`).
- The separate Express server. The contact form stays a Netlify Function (ADR 0002).

## [1.0.0] - 2026-11-08

First stable release of kamycoding.com, built with Angular and deployed on Netlify. It serves as the baseline before the v2 redesign.

### Added

- Single-page portfolio with hero, projects, experience, skills and contact sections.
- Internationalization in English and German, switchable at runtime.
- Contact form with validation on the client and on the server.
- Legal pages: legal notice (`/legal-notice`) and privacy policy (`/privacy-policy`).
- Responsive layout for mobile, tablet and desktop.
- Serverless endpoint `POST /api/contact` running as a Netlify Function.
- Transactional email delivery through the Brevo API, with the sender set as reply-to.
- Strict request validation with a zod schema; unknown fields are rejected.
- Typed environment configuration, validated at startup.
- 15 second timeout on outgoing requests, with network, timeout and provider errors handled separately.
- Logs contain allow-listed diagnostics only, never API keys or personal data.

### Security

- Rate limiting: 5 requests per 3 minutes per IP.
- Honeypot field against automated spam.
- No tracking, analytics or third-party scripts.

### Tests

- Unit tests for the contact function with Vitest (success, validation, honeypot, provider errors, network errors, timeout, method handling, rate limit config).

[Unreleased]: https://github.com/kamycoding/portfolio/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/kamycoding/portfolio/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/kamycoding/portfolio/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/kamycoding/portfolio/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/kamycoding/portfolio/releases/tag/v1.0.0
