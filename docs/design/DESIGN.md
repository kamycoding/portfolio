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

All colors are CSS custom properties in `src/app/globals.css`, one block per color theme (below), exposed to Tailwind v4 with `@theme inline`. The token names come from `prototype/style.css`.

**Color themes** (built into VS Code, picked like VS Code's Color Theme quick pick): Dark Modern (default dark, `:root`), Light Modern (default light), Monokai and Solarized Dark, one token block each in `globals.css`, listed in `src/lib/themes.ts`. The default follows the system. The picker opens from `T`, the top bar button, the status bar and the palette's "Color Theme" command, with the current theme preselected: arrow keys preview, Enter keeps, Escape restores. Monokai and Solarized count as dark for `dark:` styles. Real VS Code colors, with lightness adjusted for AA where needed (listed per block). The OG image stays on Dark Modern.

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

1. **Top bar** (56px, fixed): brand `k/ kamycoding v2.0`, file tabs as navigation (active tab follows scroll), `Ctrl K` button, Color Theme button (opens the theme picker), EN/DE switch, a 1px scroll progress line.
2. **Rulers** (22px, fixed, desktop only): canvas tick marks every 8px, labels every 80px, vertical ruler follows scroll. Crosshair lines and an `x y` readout follow the mouse, hidden over interactive UI.
3. **Status bar** (28px, fixed): branch, build state, current file, UTF-8, LF, line number from scroll, theme name (opens the theme picker), cat state, Cologne time.
4. **Breadcrumb** per section (sticky under the rulers): `src › app › work.tsx` left, a short meta right.

## Sections

### Hero (`index.tsx`)
Concept "Blueprint ⇄ Build": everything starts as a plan (architecture background), so the hero shows the editor as a technical drawing that turns into the real UI.
- Left: only the name `Kamyar Zamanfar` as the H1 (large, tight tracking, letters rise in once after the intro, wraps only between the two words) and the role `Full-Stack Developer` in mono, typed in with the blinking caret. The same two lines feed the OG image. No lede, buttons, social icons, status row, scroll hint or ticker.
- Right: editor panel with the cat, tabs `kamyar.ts` and `types.ts` (switchable), syntax-highlighted object, hover cards on properties (TypeScript-style), `Ln, Col` readout, blinking caret, terminal below.
- Blueprint layer (decorative, `aria-hidden`): thin outlines of the editor, terminal, code lines and cat, drawn from the real layout. Dimension lines with arrows show live px values (measured with `ResizeObserver`). Title block: PROJECT kamycoding.com, SCALE 1:1, SHEET 01/05 (from the section list), DATE (build date).
- Plan/build slider: a handle over the editor, build on the left, plan on the right (`clip-path`). Accessible slider (`role="slider"`, arrows, Page keys, Home/End, Escape or double click resets, value "Plan 40 percent"). Rests on the build. The tilt pauses while dragging; keyboard focus inside the editor brings the build back.
- Entrance: after every intro (also "Replay intro") the hero starts as the plan and builds from left to right in about 1.5s. Not replayed on a language switch. Reduced motion shows the build directly.
- Terminal: prompt `~/kamycoding main ✓ ❯` (the chevron turns red after a failed command), inline ghost suggestion (Tab or Right Arrow accepts, nothing on an empty prompt), history with Up/Down, Ctrl+L clears, Ctrl+C cancels the line. Commands: `help`, `whoami`, `ls` and `ls projects` (clickable: sections scroll, projects open their README drawer), `git log` (real contribution stats), `blueprint`, `theme` (quick dark/light toggle), `theme list`, `theme <name>`, `lang [de|en]`, `contact` (scrolls to the form and focuses it), `pet cat`, `clear`, `sudo hire-kamyar`. Output is announced politely; nothing takes focus or scrolls the page on load.
- Dot grid background, lights up under the cursor. Editor tilts slightly toward the mouse (max 5deg).

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

### Journal reading (`blog/`)
- Article body in Geist Sans at 17px, about 70ch wide, line height 1.75. Prose styles restore headings, lists, quotes, links and inline code after Tailwind's reset (`prose.module.css`).
- Code blocks are normal fenced Markdown: ```` ```ts filename="example.ts" {2} ````, with `// [!code ++]` and `// [!code --]` for diffs. The frame shows the filename (or the language), a Copy button and a polite status message. Copy writes the resulting code, without removed lines or markers; a failure says so.
- Token colours come from the real VS Code themes; the few below WCAG AA are raised in `rehype.mjs`. Highlighted and diff lines keep the theme background and use a left bar plus a `+`/`-` sign, so meaning does not depend on colour alone.
- Outline: h2 and h3 only. From 1101px a sticky column next to the text with scroll-spy (`aria-current="location"`); below that a closed native `<details>` Contents control above the body that closes after a jump. Both are in the server HTML, so nothing shifts.
- The status bar shows the share of the article body read (`42% read`), plain text, never announced. The footer does not count, and it resets on navigation.
- Term: German word with a dotted `--kw` underline (links use a solid one). Click, tap, Enter or Space opens a nonmodal popover with the German form, the English translation and an optional note; Escape or a tap outside closes it and focus returns. No hover opening, no vocabulary basket.
- Gloss: German line above the English line. The first part of each word group is a button: hover, focus or a tap (pins it, `aria-pressed`, Escape unpins) highlights the group on both lines with `--kw-a` and a solid underline. Buttons are described by their English parts.
- Dialog: speaker-labelled German lines; a "Show English" toggle (`aria-pressed`, check mark in reserved space) reveals the English lines.
- Quiz: radios in a fieldset, Check, then one live region with "Correct." or "Not quite." and the explanation. The right answer and a wrong pick get a text label plus a glyph and border in `--ok` or `--err`. The same button becomes "Try again", which resets and focuses the first choice.
- Callout (Note `--kw`, Tip `--ok`, Warning `--str`): accent bar and a coloured mono label on `--bg`. TLDR and Takeaways: a region labelled in `--com`, not a heading, so the Outline stays unchanged. Figure: image with intrinsic size, hairline border and a muted caption.
- None of them animate. States change colour and decoration only, so nothing shifts; all text and indicator colours were checked for AA in every theme.

## Global interactions
- **Intro**: a `pnpm build` log (spinner, steps of the career, progress bar, route table, `Ready in`). Runs on every load, skippable with any key, skipped with reduced motion.
- **Command palette** (`Ctrl K`): grouped commands, keyboard navigation, focus returns on close.
- **Shortcuts**: `G W/A/S/C/G` navigate, `C` copy email, `T` Color Theme picker, `L` language, `M` cat, `?` palette. Ignored while typing.
- **Cursor** (fine pointers only): dot plus easing ring, ring grows on links with a small label (`go`, `↗`, `copy`, `open`, `run`, `pet`), caret on text and code.

## Accessibility (must keep)
- Skip link, landmarks, visible focus (`--kw` outline), real buttons and links.
- `prefers-reduced-motion`: no intro, no typing, no tilt, no lag, no blueprint entrance.
- Color contrast checked in every theme (WCAG AA for text, muted, faint and comment colors).
- Hover-only content also reachable by keyboard (hover cards on focus, drawer from the list).
- Custom cursor only for `(hover: hover) and (pointer: fine)`.

## Content
All copy, in English and German, is in `prototype/app.js` (`T`, `PROJECTS`, `COMMITS`, `REVIEWS`, `STACK`, `SERVICES`). Move it into `src/content/` and `messages/en.json`, `messages/de.json`. Do not invent facts. Open questions are listed in ROADMAP.
