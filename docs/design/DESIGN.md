# kamycoding v2: design spec

The approved design lives in `docs/design/prototype/` as plain HTML, CSS and JS. It is the visual reference, not code to copy. Port it into Next.js with the same look and behavior, using the stack in `CLAUDE.md`.

Brand: `kamycoding` (domain kamycoding.com, terminal prompt `~/kamycoding $`). The prototype still says `kamyar.dev` in a few places: that was a mistake, do not port it.

Open it locally with `pnpm dlx serve docs/design/prototype` and compare every section side by side while building.

## Concept

The whole site is a code editor. Each page is a file:

| Section | File name in the UI | Route |
|---|---|---|
| Hero | `index.tsx` | `/` |
| Projects | `work.tsx` | `/#work` |
| About, experience, reviews | `about.md` | `/#about` |
| Stack, activity, services | `stack.json` | `/#stack` |
| Contact | `contact.ts` | `/#contact` |

One page with anchors for now. The legal pages are separate routes: `/legal-notice` and `/privacy-policy`.

## Tokens

All colors are CSS custom properties on `:root` (dark) and `[data-theme=light]`. Copy the values from `prototype/style.css` (top of file) into `src/app/globals.css` and expose them to Tailwind v4 with `@theme inline`.

| Token | Use |
|---|---|
| `--bg`, `--bg-2` | page background, recessed areas |
| `--panel`, `--panel-2`, `--panel-3` | editor panels, hover and active states |
| `--text`, `--muted`, `--faint` | text hierarchy |
| `--hair`, `--hair-2`, `--hair-3` | hairlines and borders, three strengths |
| `--kw` | keywords, primary accent, focus ring |
| `--str` | strings, warm accent |
| `--prop` | properties, success |
| `--num` | numbers, fourth accent |
| `--com` | code comments, section eyebrows |
| `--ok`, `--err` | status |

Project accents: Heldio `--kw`, Join `--prop`, Designer portfolio `--str`, El Pollo Loco `--num`.

## Type

- Sans: Geist (400, 500, 600). Headlines 600 with tight letter spacing (`-0.04em`).
- Mono: Geist Mono (400, 500). Labels, code, terminal, status bar.
- Load both with the `geist` npm package (`geist/font/sans`, `geist/font/mono`). No Google Fonts request.

## Layout shell (on every page)

1. **Top bar** (56px, fixed): brand `k/ kamycoding v2.0`, file tabs as navigation (active tab follows scroll), `Ctrl K` button, theme toggle, EN/DE switch, a 1px scroll progress line.
2. **Rulers** (22px, fixed, desktop only): canvas tick marks every 8px, labels every 80px, vertical ruler follows scroll. Crosshair lines and an `x y` readout follow the mouse, hidden over interactive UI.
3. **Status bar** (28px, fixed): branch, build state, current file, UTF-8, LF, line number from scroll, theme, cat state, Cologne time.
4. **Breadcrumb** per section (sticky under the rulers): `src › app › work.tsx` left, a short meta right.

## Sections

### Hero (`index.tsx`)
- Comment line, headline typed once after the intro (two lines, second line muted), lede, CTAs (`See my work`, `Copy email`, GitHub, LinkedIn icon buttons), status row (`Open to work | building Heldio MVP | learning Django | Cologne time`).
- Right: editor panel with tabs `kamyar.ts` and `types.ts` (switchable), syntax-highlighted object, hover cards on properties (TypeScript-style), `Ln, Col` readout, blinking caret.
- Terminal under the editor with real commands: `help`, `whoami`, `ls`, `open <section>`, `projects`, `stack`, `contact`, `cat`, `theme`, `lang`, `date`, `clear`, `sudo hire-kamyar`. History with arrow keys, Tab completion.
- Dot grid background, lights up under the cursor. Editor tilts slightly toward the mouse (max 5deg).
- Tech ticker strip below the hero.

### The cat
One SVG component, used on the hero editor and on the contact form. States: asleep (breathing, `z z`, tail swing), purr on long hover (`prrr`), awake on click (stretch, eyes open, pupils follow the mouse, `Meow`, code line `status: "awake"`), back to sleep after 7s. State is shared (one store), shown in the status bar.

### Work (`work.tsx`)
- `ls -la projects/` list: permission string, big folder name, context and year, tagline, stack icons, status dot, arrow.
- Hover: a cover follows the pointer with easing.
- Click: a side drawer (`README.md` of the project) with cover, title, description, role/time/context/status table, two notes, stack pills, links. Arrow keys switch projects, Esc closes, focus is trapped and returned.
- Covers are line drawings (`prototype/art.js`), one per project, framed as a browser window with crop marks and a dimension line. Port each drawing as its own React SVG component.

### About (`about.md`)
- Markdown-styled text with faint `**` markers, three counting facts.
- Portrait as ASCII art on canvas; a round lens reveals the photo under the cursor; a button renders the full photo.
- Experience as `git log --graph`: hash, refs (`HEAD → main`, `training`, tags), conventional commit title, role, text, a green diff line, stack pills.
- Reviews as pull request approvals.

### Stack (`stack.json`)
Two stacked blocks, then the services.
- Explorer ("Explorer: Stack"): the four groups as folders, side by side on desktop (two columns on tablets, one on phones). Each technology is a file with a fitting name and its icon (for example `next.config.ts`, `schema.sql`); the real name shows on hover and focus, always on touch screens, and is the accessible name. Folders collapse with a button (`aria-expanded`); files are one tab stop per folder, moved with the arrow keys.
- GitHub contributions (`contributions.json`), full width: the last 52 weeks from real data (ADR 0006) in the site's `--kw` levels, month labels, less/more legend, profile link. Tooltips with date and count on hover and keyboard focus. One left-to-right reveal wave when the block first scrolls into view and a soft pulse on today's cell, both off with reduced motion. A comment-style stats line: total, best day, longest streak, active days. Phones scroll the grid inside the block, starting at the latest weeks.
- Four services written as functions: `frontend()`, `fullstack()`, `mvp()`, `fromFigma()`.

### Contact (`contact.ts`)
- Direct links and local time on the left.
- Form written as `await sendMessage({ name, email, message })` with a privacy checkbox. Errors look like TypeScript errors (red squiggle plus message). `Ctrl Enter` submits. Output panel shows the result.
- Uses the shared zod schema and posts to the Netlify function (see ROADMAP).

### Footer
Outlined `kamycoding.com` wordmark, page links, elsewhere links, legal links, copyright.

## Global interactions
- **Intro**: a `pnpm build` log (spinner, steps of the career, progress bar, route table, `Ready in`). Runs on every load, skippable with any key, skipped with reduced motion.
- **Command palette** (`Ctrl K`): grouped commands, keyboard navigation, focus returns on close.
- **Shortcuts**: `G W/A/S/C/G` navigate, `C` copy email, `T` theme, `L` language, `M` cat, `?` palette. Ignored while typing.
- **Cursor** (fine pointers only): dot plus easing ring, ring grows on links with a small label (`go`, `↗`, `copy`, `open`, `run`, `pet`), caret on text and code.

## Accessibility (must keep)
- Skip link, landmarks, visible focus (`--kw` outline), real buttons and links.
- `prefers-reduced-motion`: no intro, no typing, no tilt, no lag, no ticker.
- Color contrast checked in both themes.
- Hover-only content also reachable by keyboard (hover cards on focus, drawer from the list).
- Custom cursor only for `(hover: hover) and (pointer: fine)`.

## Content
All copy, in English and German, is in `prototype/app.js` (`T`, `PROJECTS`, `COMMITS`, `REVIEWS`, `STACK`, `SERVICES`). Move it into `src/content/` and `messages/en.json`, `messages/de.json`. Do not invent facts. Open questions are listed in ROADMAP.
