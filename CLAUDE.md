# CLAUDE.md

Guidance for Claude Code in this repository. Read this first, every session.

## Project

Personal portfolio of Kamyar Zamanfar, full-stack developer near Cologne. Live at kamycoding.com, deployed on Netlify from `main`.

- v1 (Angular) is frozen at tag `v1.0.0`. Never touch that tag.
- v2 is built on the branch `redesign/v2`. It started from the free Zolt template by shadcn/studio (MIT, see `docs/adr/0001-migrate-angular-to-nextjs.md`); the UI is now a custom editor design (see `docs/adr/0003-custom-editor-design.md`).
- The design spec is `docs/design/DESIGN.md`, the approved prototype is in `docs/design/prototype/` (reference only, never imported). Brand: kamycoding.
- English and German from the start, routing in `docs/adr/0004-locale-routing.md`.
- The portfolio has no separate backend. See `docs/adr/0002-no-separate-backend.md`.
- The step-by-step plan lives in `docs/ROADMAP.md`. Work only on the current phase.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (design tokens in `src/app/globals.css`), next-intl, next-themes, Geist fonts, zod. Package manager: pnpm (pinned in `package.json`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
pnpm check-types
```

## Working rules (non-negotiable)

1. Never write code, change files, delete files or run installs without Kamyar's explicit OK for that exact step. First explain what you will change and why, list the affected files, then wait.
2. Never commit or push, not even with approval. Kamyar does all commits and pushes himself. When a step is done, suggest a short Conventional Commit message instead.
3. Code, comments, commit messages and docs: English only. No Persian anywhere in the repo.
4. Never use the em dash character in any text (docs, UI copy, comments). Use a comma, a colon or a new sentence instead.
5. Comments are short (1 to 2 lines) and explain the why, not the what. Point to an ADR instead of repeating it. Match the style of the surrounding code.
6. For every important architecture decision: explain the problem, show the options, recommend one with reasons, name the affected files, say whether it is temporary, ADR-worthy or overengineering. Then wait for the OK.
7. Follow best practices, but keep it simple. Kamyar wants to understand every change, so explain new concepts briefly when they come up.
8. Keep each phase small enough to review in one sitting. One phase, one commit.

## Content facts (do not invent anything)

- Name: Kamyar Zamanfar. Role: Full-stack developer. Based near Cologne, Germany.
- Background: architecture degree, then software development.
- Heldio: co-founder and frontend developer, AI platform for contextual language learning.
- Developer Akademie: full-stack and AI software developer training. Front-end certificate on 18 Sep 2026, other modules ongoing.
- OsifyAI: freelance frontend developer, Jun 2025 to Nov 2025.
- Tarahimo: co-founder, Oct 2022 to Aug 2024.
- Links: github.com/kamycoding, linkedin.com/in/kamyarzamanfar, contact@kamycoding.com.
- If a fact is missing (dates, photos, numbers), ask. Never fill it with a guess.

## Licensing

- Zolt is MIT: keep `LICENSE.md` and a short credit line in the footer while files derived from Zolt remain (ADR 0003). Check in Phase 11 whether both can go.
- `LICENSE` is Kamyar's own: MIT for the source code, with a content exclusion notice. Keep it.
