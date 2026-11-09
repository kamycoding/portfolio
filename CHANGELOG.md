# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Version 2 is in development on the `redesign/v2` branch.

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
- Repository hygiene: GitHub Actions CI, Dependabot, Vitest, commitlint and pre-commit hooks, security policy, `security.txt`, issue and pull request templates, contributing guide and code of conduct.

### Changed

- The license now has two parts: source code under MIT, content all rights reserved.
- Privacy policy section 10 describes the language cookie and the theme setting of v2 instead of the v1 language key in Local Storage.
- Contact function: accepts only JSON (`415`), refuses other origins (`403`) and bodies above 10 KB (`413`), rejects control characters in the name, and caps the Brevo timeout at 8 seconds.

### Removed

- The Angular application (preserved at tag `v1.0.0`).
- The separate Express server. The contact form stays a Netlify Function (ADR 0002).

### Security

- Upgraded Next.js to 16.4.2 and zod to 4.6.7, refreshed stale transitive dependencies. `pnpm audit` reports no known vulnerabilities in production dependencies.
- Security headers for production builds: Content Security Policy (Report-Only for now), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy` (ADR 0005).
- Removed the `X-Powered-By` header and set the `Secure` flag on the language cookie.
- `.gitignore` covers every environment file and the Netlify CLI folder.
- `security.txt` and the security policy list GitHub private vulnerability reporting next to email.
- ESLint forbids `dangerouslySetInnerHTML`.

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

[Unreleased]: https://github.com/kamycoding/portfolio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/kamycoding/portfolio/releases/tag/v1.0.0
