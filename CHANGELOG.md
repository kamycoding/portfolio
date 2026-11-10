# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0] - 2026-11-10

The Journal: a bilingual blog about building software in Germany, with interactive learning components and audio, its first article, a place on the homepage and a redesigned 404 page.

### Added

- Journal at `/blog` and `/de/blog`: MDX articles in the repository with validated metadata, static article routes, editor tabs and breadcrumbs, and a `blog/` tab in the top bar and footer. A post that exists in only one language shows a localized notice in the other and links to the published version (ADR 0007).
- First article, in English: "German for Developers: What People Say in Dailies and Calls", with a textbook diff, 20 playable phrases, a word-by-word sentence, a standup dialogue and a quiz.
- Second article, in English and German: "The JavaScript Event Loop: Predict the Output". It teaches the call stack, microtasks and tasks through three output puzzles, a stepper, a real `forEach(async)` bug with a measured timeline and a page-freeze demo. The claims were checked against MDN and the HTML specification.
- Interactive article components: `OutputPuzzle` (click the console lines in the order you expect, per-position feedback and a running score), `EventLoopStepper` (precomputed frames with the code, call stack, microtask queue, task queue and console, arrow keys and a live description), `AsyncRaceTimeline` (three save strategies run with real timers and measured times) and `MainThreadDemo` (a frame counter that freezes during a blocking loop and keeps going when the work is chunked with `scheduler.yield()` or `setTimeout`).
- "Listen to this article": a reusable narration player at the top of an article with play and pause, previous and next section, 1x, 1.25x and 1.5x speed, a polite status line and the current section marked in the Outline (choosing an Outline entry while it plays jumps there). Narration is authored per h2 section in `learning.json` (English and German), generated with `pnpm audio` (one clip per section and language, a narrator voice per language) and shows "Audio not generated yet" until the clips exist. Only the event loop article has narration for now.
- Reading experience: Geist Sans prose at about 70ch, code blocks with filename, copy button, highlighted lines and diffs in all four themes, an Outline with scroll-spy (a Contents control on small screens) and reading progress in the status bar. Heading IDs are generated at build time and transliterate German umlauts and ß.
- Article components: Term translations in an accessible popover that also opens on hover with a mouse, Gloss sentences with linked German and English word groups, Dialog with a Show English toggle, Quiz with check, explanation and retry, and Callout, TLDR, Takeaways and Figure blocks. Learning data lives in a validated `learning.json` per post, and an unknown id fails the build.
- Audio: play buttons for terms, Gloss sentences and dialogue lines, with same-origin clips, the spoken word group highlighted in Gloss, a local German voice as fallback and a clear unavailable state. Clips are generated locally with `pnpm audio` (a dry run unless `--generate` is given); builds never contact ElevenLabs.
- Search and sharing: published translations in the sitemap, an RSS feed per language (`/blog/rss.xml`, `/de/blog/rss.xml`), an Open Graph image per article, structured data for articles, publication-aware language alternates and an author box at the end of each article. The journal indexes are indexed now that a post is published.
- Homepage journal section (`blog/`) between the stack and the contact form, built as a split editor like VS Code's Markdown preview: an explorer tree (`blog/`, one folder per post, `en.mdx` and its h2 headings) next to a preview with the TL;DR and a "textbook vs. what people say" diff card with a play button for the spoken line, and a status bar with reading time, terms, audio clips and language. Hovering or focusing a heading shows it in the preview header and clicking opens the article there. On small screens the tree gives way to a short outline. It shows up to three posts and is hidden while nothing is published.
- Terminal: `ls blog` lists the published posts, `open <slug>` and `cat blog/<slug>` open one, with ghost suggestions like the other commands.
- Command palette: a Journal group with the journal and every published post.
- Reading cursor on journal pages: an editor caret over prose (text still selects), a small ring over links and controls and a dot elsewhere, in the theme colour with a thin outline, quieter rulers and no blueprint crosshair. The homepage keeps the blueprint cursor.
- Post metadata takes an optional `tldr`, shared by the article's TLDR block and the homepage; `learning.json` takes an optional `contrast` for the homepage diff card.

### Changed

- The real kamycoding logo (blue "{", yellow "K") replaces the "k/" mark in the top bar, the author box and the social images, through one shared `Logo` component. The homepage and article Open Graph images change with it.
- The 404 page is an editor window with the missing file as a tab, a compiler-style "Module not found" line with the real path, a "Did you mean" suggestion for the closest real route, a link to the journal and the sleeping cat.
- The privacy policy describes the journal audio and the local speech fallback, and the theme paragraph now names all four color themes.

### Fixed

- The terminal's `help` printed its message key instead of the command list, because `<name>` in the text was read as an unclosed tag.
- The custom cursor stays visible above Term popovers.
- The intro hides its text at once when it ends and fades only the background, so no half-transparent text is left on the page.
- The review badge and the key hint on the contact send button reach WCAG AA contrast in every theme.

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

[Unreleased]: https://github.com/kamycoding/portfolio/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/kamycoding/portfolio/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/kamycoding/portfolio/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/kamycoding/portfolio/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/kamycoding/portfolio/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/kamycoding/portfolio/releases/tag/v1.0.0
