# ADR 0005: Content Security Policy strategy

- Status: Accepted
- Date: 2026-11-09

## Context

The site had no security headers (security review, finding M1). A Content Security Policy is the main defence in depth against cross-site scripting, which matters once the terminal and the contact form echo user input.

Two things make a strict CSP hard for this site:

- Next.js writes the page data as inline scripts (`self.__next_f.push(...)`). Their content differs per page and per build.
- next-themes adds one inline script that sets the theme before the first paint.

The pages are static (SSG) and served from the Netlify CDN, which keeps the site fast and cheap.

## Options

1. **Nonces**: the proxy creates a new nonce per request and every inline script carries it. Strong protection, but every page becomes dynamic: no static pages, no CDN caching, a function call per visit. next-themes also needs the nonce passed in.
2. **Hashes**: list a hash for every inline script. Not practical, because the Next.js data scripts change with every page and every build.
3. **`'unsafe-inline'` for scripts, static pages**: allow inline scripts, lock everything else down (only our own origin, no plugins, no frames, no foreign form targets).

Where the headers are defined:

- `netlify.toml` applies only on Netlify, cannot be tested locally and cannot tell development from production.
- `headers()` in `next.config.ts` applies to every page Next.js renders, works with `pnpm start` for local checks and can be limited to production builds.

## Decision

Option 3, defined in `headers()` in `next.config.ts`, production builds only (the dev server needs `eval` for hot reload).

The CSP ships as `Content-Security-Policy-Report-Only` first. Violations show up in the browser console; there is no report endpoint (overengineering for this site). While the CSP is Report-Only, `frame-ancestors` is only reported, so `X-Frame-Options: DENY` provides the clickjacking protection.

The other headers are enforced from the start: `Strict-Transport-Security` (with `includeSubDomains`, no `preload`), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`.

## When we switch to enforcing

In Phase 10, after all interactive features exist (Phase 9: intro, command palette, shortcuts, cursor; earlier phases: terminal, contact form):

1. Check a Netlify Deploy Preview with `curl -I` and the browser console, in both themes, both languages and with reduced motion. No CSP violations may remain.
2. Rename the header to `Content-Security-Policy` and add `upgrade-insecure-requests` (ignored in Report-Only mode).

## Update: enforced (Phase 10, 2026-11-09)

- The header is now `Content-Security-Policy` with `upgrade-insecure-requests` added. The policy itself is unchanged.
- Checked locally on the production build (`pnpm start`): every page in both themes and both languages, with and without reduced motion, the 404, and all interactions (intro and replay, command palette, shortcuts, drawer, terminal, portrait, JSON folding, contact form, language switch). No violations, no blocked requests.
- The Deploy Preview needs a Netlify team login, so the console check there is done by Kamyar on the Report-Only preview before the enforcing commit is pushed. Scripts that Netlify injects only into previews may show up as blocked there; that does not affect production.
- `X-Frame-Options: DENY` stays for older browsers that do not know `frame-ancestors`.

## Consequences

- Pages stay static and CDN-cached.
- `'unsafe-inline'` means the CSP alone does not stop an injected inline script. The real XSS defence is React's text rendering and the ESLint rule `react/no-danger`: no raw HTML from user input or translations.
- Any new origin (fonts, scripts, images, APIs) needs a change to the policy and an update of this ADR.
- The contact function's JSON responses do not get these headers. They are not HTML, and they already send `nosniff`.
- If the site ever needs dynamic pages with user content, revisit option 1 (nonces).
