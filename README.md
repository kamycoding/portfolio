# kamycoding.com

[![CI](https://github.com/kamycoding/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/kamycoding/portfolio/actions/workflows/ci.yml)

Personal portfolio of Kamyar Zamanfar, full-stack developer near Cologne.

Version 2 is a rebuild in Next.js. The whole site is designed as a code editor: each section is a file, with a terminal, a command palette, line-drawing project covers and a cat. It ships in English and German, in a dark and a light theme.

**Live:** [kamycoding.com](https://kamycoding.com) (still shows v1 until the v2 release). Version 1 (Angular) is preserved at tag [`v1.0.0`](https://github.com/kamycoding/portfolio/releases/tag/v1.0.0).

<!-- Screenshot: added with the v2 release (docs/ROADMAP.md, Phase 10). -->

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 with design tokens for the dark and light theme
- next-intl (English and German), next-themes, Geist fonts
- zod for validation, Vitest for tests
- Netlify: hosting and a serverless function for the contact form
- GitHub Actions for CI, Dependabot for updates

## Getting started

Requirements: Node 24 (see `.nvmrc`) and pnpm (pinned in `package.json`).

```bash
nvm use                # Node 24 from .nvmrc
corepack enable pnpm   # pnpm version from package.json
pnpm install           # also installs the git hooks
pnpm dev               # http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint with automatic fixes |
| `pnpm format` | Prettier on `src/` |
| `pnpm check-types` | TypeScript check without emitting files |
| `pnpm test` | Vitest, single run |

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). Git hooks check the commit message and lint and format staged files. CI runs the frozen install, lint, type check, tests and build on every push and pull request.

## Folder structure

```text
.
├── .github/              CI workflow, Dependabot, issue and PR templates
├── docs/
│   ├── adr/              Architecture decision records
│   ├── design/           Design spec and the approved prototype (reference only)
│   └── ROADMAP.md        Phase plan
├── messages/             UI copy in English and German
├── netlify/              Netlify function for the contact form and its tests
├── public/               Static files (icons, .well-known/security.txt)
└── src/
    ├── app/              Routes, layouts and global styles (design tokens)
    ├── components/       React components
    ├── i18n/             Locale routing and message loading
    ├── lib/              Shared helpers
    └── proxy.ts          Locale detection and redirects
```

## Documentation

- [Architecture decisions](docs/adr/)
- [Design spec and prototype](docs/design/)
- [Roadmap](docs/ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md) and [security policy](SECURITY.md)

## License

The source code is licensed under MIT. Texts, photos, the design, illustrations and the cat are all rights reserved. See [LICENSE](LICENSE) for both parts. [LICENSE.md](LICENSE.md) keeps the MIT notice of the Zolt template this version started from.
