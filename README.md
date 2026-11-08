# kamycoding.com

Personal portfolio of Kamyar Zamanfar, full-stack developer near Cologne.

Version 2 is a rebuild in Next.js. The whole site is designed as a code editor: each section is a file, with a terminal, a command palette and line-drawing project covers. Version 1 (Angular) is preserved at tag `v1.0.0`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 with design tokens for dark and light themes
- next-intl (English and German), next-themes, Geist fonts
- Netlify: hosting and a serverless function for the contact form

## Getting started

Requires Node 24 and pnpm (pinned in `package.json`, enable it with `corepack enable pnpm`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
pnpm check-types
```

## Project docs

- `docs/ROADMAP.md`: the phase plan
- `docs/design/DESIGN.md`: the design spec, with the approved prototype in `docs/design/prototype/`
- `docs/adr/`: architecture decisions

## License

The source code is MIT licensed, see `LICENSE`. Personal content, photos and branding are excluded, see the notice in `LICENSE`. `LICENSE.md` keeps the MIT notice of the Zolt template this version started from.
