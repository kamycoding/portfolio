<div align="center">

<img src="docs/media/og-image.webp" alt="kamycoding: I build web products. From idea to deploy. Kamyar Zamanfar, kamycoding.com" width="720">

# kamycoding.com

I build web products. From idea to deploy.

[Website](https://kamycoding.com) · [v1.0.0 release](https://github.com/kamycoding/portfolio/releases/tag/v1.0.0) · [LinkedIn](https://www.linkedin.com/in/kamyarzamanfar)

[![CI](https://github.com/kamycoding/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/kamycoding/portfolio/actions/workflows/ci.yml)
[![License: MIT (code)](https://img.shields.io/badge/license-MIT%20%28code%29-blue)](LICENSE)
[![Node 24](https://img.shields.io/badge/node-24-339933)](.nvmrc)
[![pnpm 12.18.0](https://img.shields.io/badge/pnpm-12.18.0-F69220)](package.json)

</div>

Personal portfolio of Kamyar Zamanfar, full-stack developer near Cologne.

<p align="center">
  <img src="docs/media/hero-dark.webp" alt="Hero section in the dark theme: typed headline, editor panel with kamyar.ts, terminal and the cat" width="49%">
  <img src="docs/media/hero-light.webp" alt="The same hero section in the light theme" width="49%">
</p>

## Concept

The whole site is designed as a code editor. Each section is a file (`index.tsx`, `work.tsx`, `about.md`, `stack.json`, `contact.ts`) with file tabs, rulers, breadcrumbs and a status bar. The page builds itself with a `pnpm build` log on load, and the contact form is written as a function call. It ships in English and German, in a dark and a light theme, as static pages.

## Features

- Hero with a typed headline, an editor panel with TypeScript-style hover cards and a terminal with 13 commands
- Project list as `ls -la` with a pointer preview and a README drawer per project; line-drawing covers as SVG components
- About as Markdown with an ASCII portrait, experience as a `git log` and reviews as pull request approvals
- Stack as a foldable JSON tree, a GitHub contribution heatmap refreshed daily and services as functions
- Contact form as `sendMessage({ ... })` with TypeScript-style errors, validated by the same schema in the browser and in the Netlify function
- Command palette (`Ctrl K` / `⌘ K`), keyboard shortcuts, a custom cursor, and a cat that wakes up
- Legal notice and privacy policy in both languages

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, static generation), React 19, TypeScript |
| Styling | Tailwind CSS v4 with design tokens, CSS Modules, Geist fonts |
| Content | next-intl (English at `/`, German at `/de`), next-themes |
| Validation and tests | zod (shared schema), Vitest |
| Hosting | Netlify CDN, Netlify Functions, Brevo for email delivery |
| Tooling | pnpm, ESLint, Prettier, husky, lint-staged, commitlint, GitHub Actions |

## Architecture

```mermaid
flowchart LR
  B["Browser"] -->|"pages and assets"| E["Netlify Edge: proxy.ts (language)"]
  E --> C["Netlify CDN: static pages (en, de)"]
  B -->|"POST /api/contact"| F["Netlify Function: contact.mts"]
  F -->|"validated message"| M["Brevo: transactional email"]
  G["GitHub GraphQL API"] -.->|"contributions, at build time"| C
```

The site has no separate backend ([ADR 0002](docs/adr/0002-no-separate-backend.md)). The only server code is the contact function: it accepts JSON from the own origin only, checks the size, validates with the shared schema, uses a honeypot and Netlify's rate limit, and logs one line per request without personal data.

| Folder | Contents |
| --- | --- |
| `src/app/` | Routes and layouts per locale, design tokens, metadata, sitemap, Open Graph images |
| `src/components/` | Sections (`hero`, `work`, `about`, `stack`, `contact`, `legal`) and the editor shell |
| `src/content/` | Projects, experience, reviews, stack and services in English and German |
| `src/hooks/`, `src/lib/` | Small shared stores and helpers, the contact schema |
| `src/i18n/`, `src/proxy.ts` | Locale routing and detection ([ADR 0004](docs/adr/0004-locale-routing.md)) |
| `messages/` | UI copy in English and German |
| `netlify/` | The contact function and its tests |

## Getting started

Requirements: Node from [`.nvmrc`](.nvmrc) and pnpm, pinned in [`package.json`](package.json).

```bash
nvm use                # Node 24 from .nvmrc
corepack enable pnpm   # pnpm version from package.json
pnpm install           # also installs the git hooks
pnpm dev               # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Production build, after refreshing the GitHub contributions |
| `pnpm contributions:update` | Refresh `src/content/contributions.json` (needs `GITHUB_CONTRIBUTIONS_TOKEN`) |
| `pnpm start` | Serve the production build (security headers are active here) |
| `pnpm lint` / `pnpm lint:fix` | ESLint, with automatic fixes |
| `pnpm format` | Prettier on `src/` |
| `pnpm check-types` | TypeScript check without emitting files |
| `pnpm test` | Vitest, single run (app and contact function) |

The contact function needs the variables in [`.env.example`](.env.example), set per deploy context in Netlify. There is no local Netlify setup: the function is covered by tests, and the form is tested end to end on Deploy Previews.

The contribution heatmap is fetched from the GitHub API during production builds only. Without `GITHUB_CONTRIBUTIONS_TOKEN` (local builds, Deploy Previews, forks) the build uses the committed snapshot ([ADR 0006](docs/adr/0006-github-contributions-at-build-time.md)).

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). Git hooks check the message and lint and format staged files.

## Quality and security

- CI on every push and pull request: frozen install, lint, type check, tests and build, with actions pinned to full commit SHAs
- CodeQL code scanning, Dependabot, secret scanning with push protection
- Enforced Content Security Policy and security headers ([ADR 0005](docs/adr/0005-csp-strategy.md))
- Accessibility: keyboard access everywhere, visible focus, reduced motion respected, contrast tuned to WCAG AA
- [`security.txt`](public/.well-known/security.txt) and a [security policy](SECURITY.md) for private reports

## Architecture decisions

- [ADR 0001: Move the portfolio from Angular to Next.js](docs/adr/0001-migrate-angular-to-nextjs.md)
- [ADR 0002: No separate backend for the portfolio](docs/adr/0002-no-separate-backend.md)
- [ADR 0003: Replace the Zolt UI with a custom editor design](docs/adr/0003-custom-editor-design.md)
- [ADR 0004: Locale routing with next-intl](docs/adr/0004-locale-routing.md)
- [ADR 0005: Content Security Policy strategy](docs/adr/0005-csp-strategy.md)
- [ADR 0006: GitHub contributions at build time](docs/adr/0006-github-contributions-at-build-time.md)

The design spec and the approved prototype are in [`docs/design/`](docs/design/), the phase plan in [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Versions

- v1 (Angular) is preserved at [`v1.0.0`](https://github.com/kamycoding/portfolio/releases/tag/v1.0.0).
- v2 is built on the `redesign/v2` branch and goes live with v2.0.0. Changes are listed in the [changelog](CHANGELOG.md).

## License

- Source code: MIT.
- Content (texts, photos, the design, illustrations and the cat): all rights reserved.

See [LICENSE](LICENSE) for both parts.

## Credits

- v2 started from the free Zolt template by shadcn/studio (MIT). The UI was replaced by the custom editor design ([ADR 0003](docs/adr/0003-custom-editor-design.md)); [LICENSE.md](LICENSE.md) keeps its notice.
- [Geist](https://vercel.com/font) fonts by Vercel.

## Contact

- Website: [kamycoding.com](https://kamycoding.com)
- LinkedIn: [kamyarzamanfar](https://www.linkedin.com/in/kamyarzamanfar)
- Email: [contact@kamycoding.com](mailto:contact@kamycoding.com)
- Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md)
