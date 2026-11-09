# ADR 0004: Locale routing with next-intl

- Status: Accepted
- Date: 2026-11-09

## Context

v2 ships in English and German from the start. v1 had a single URL per page and switched the language on the client. With server-rendered pages, the language has to be part of the URL so search engines can index both versions and every page can be rendered statically. The URL scheme is hard to change later without breaking links and search results.

## Options

1. `localePrefix: 'always'`: every URL starts with `/en` or `/de`, `/` redirects.
2. `localePrefix: 'as-needed'`: English stays at `/`, German lives under `/de`.
3. Separate domains per language.

For detection: with browser language detection on, a visitor whose browser prefers German is sent from `/` to `/de`. Without it, `/` is always English.

## Decision

Option 2 with browser language detection on.

- Existing URLs (`/`, later `/legal-notice` and `/privacy-policy`) keep working in English, so links and search results from v1 stay valid.
- German visitors, the main audience, land on German content without an extra click.
- One domain, one deploy.

Configured in `src/i18n/routing.ts` and applied by `src/proxy.ts`.

## Consequences

- To remember a manual language switch, next-intl sets a `NEXT_LOCALE` cookie. The privacy policy must mention it (Phase 7).
- The proxy runs on every page request. It skips `/api` (the contact function) and files.
- Localized paths (for example `/de/impressum`) are possible later through next-intl `pathnames` without changing this decision.
