# Portfolio v2 roadmap

Branch: `redesign/v2`. One phase, one commit. Kamyar commits and pushes.

## Phase 1: Bring in the v2 source
- Remove the Angular app from the branch (it stays safe in tag `v1.0.0`).
- Keep `.git`, the Netlify contact function and anything Netlify needs.
- Copy in the personalized Zolt source and these docs.
- `pnpm install`, `pnpm dev`, `pnpm build` must all work.
- Commit: `feat: start v2 on Next.js (Zolt based)`

## Phase 2: Legal pages
- Port the Impressum (`/legal-notice`) and privacy policy (`/privacy-policy`) from v1, text as it is (English).
- Keep the v1 URLs, store the text as MDX so German can be added per locale later.
- Link both pages in the footer.
- Commit: `feat: add legal notice and privacy policy`

## Phase 3: Contact form
- Connect the v2 contact form to the existing Netlify function (Brevo) via `/api/contact`.
- Fields as in v1: name, email, message, privacy checkbox, honeypot. Remove the template service select.
- One shared zod schema in `src/lib/contact/` for the form and the function, remove `server/`.
- Checkbox text: "I have read the privacy policy" (matches the legal basis in the policy).
- Inline success and error status (`aria-live`), English only until Phase 7.
- Local testing with `netlify dev` (pinned via `pnpm dlx`), secrets from the linked Netlify site, `.env.example` without values.
- Re-enable the function tests with Vitest, add schema tests.
- Commit: `feat: connect contact form to Netlify function`

## Phase 4: Clean up
- Delete unused template images, pages and components.
- Remove template files that do not belong here (documentation.html, hire-us.html, vercel.json, template README and CHANGELOG).
- Write a real README for the portfolio.
- `pnpm lint` and `pnpm check-types` pass.
- Commit: `chore: remove unused template code`

## Phase 5: Content check
- Confirm every date, title and text with Kamyar.
- Add missing photos (personal photos, colleague avatars) if he provides them.
- Decide the accent color (Zolt orange or brand color).

## Phase 6: Theme
- Light and dark mode both polished (next-themes, toggle in the side dock).
- Respect the system setting on first visit, remember the choice.
- Brand colors as CSS tokens so both modes share one palette.
- Update the privacy policy for the stored theme choice (local storage).

## Phase 7: English and German
- Add next-intl with `/en` and `/de`, reuse the translations from v1.
- Language switch in the navigation, all UI copy and case studies in both languages.
- Translate the contact form (labels, validation, status) and the legal pages.
- Update the privacy policy if next-intl sets a locale cookie.

## Phase 8: Quality
- Accessibility pass: keyboard, focus, contrast, reduced motion.
- Lighthouse and SEO: metadata, Open Graph image, sitemap.
- Set `NEXT_PUBLIC_APP_URL` (canonical URLs and JSON-LD currently render as `undefined/...`).
- Netlify Deploy Preview of the branch, test on mobile.

## Phase 9: Release
- Update CHANGELOG, merge into `main` via pull request.
- Tag `v2.0.0` and create the GitHub release (Kamyar runs the commands).
