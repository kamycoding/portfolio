# ADR 0007: Repository MDX and locally generated journal audio

- Status: Accepted
- Date: 2026-11-10

## Context

The portfolio will include a bilingual journal about building software in Germany. The visible heading is Journal, the editor tab is `blog/`, and the URL is `/blog`. Posts may exist in English, German or both. The first article will be published in English, with German added later.

Constraints from earlier decisions:

- Pages remain statically generated on Netlify (ADR 0002).
- English uses unprefixed URLs and German uses `/de` (ADR 0004).
- Visitor resources and connections stay on the own origin (ADR 0005).
- External audio generation happens outside the visitor's browser.
- Content uses the existing Next.js development, build and CI commands.

## Options

1. Use a hosted CMS.
2. Build a separate MDX compiler and generated content catalogue.
3. Use `@next/mdx` with exported metadata and a small published-post registry.

For audio:

1. Generate speech from the visitor's browser.
2. Generate speech through a runtime function.
3. Generate and cache audio through a local authoring script.

## Decision

Option 3 for content and option 3 for audio. Audio implementation follows in step 1e.

- Published translations live in `content/posts/<slug>/en.mdx` and `de.mdx`. Each file exports a `metadata` object, without YAML frontmatter.
- A small registry explicitly imports published translations. Metadata is validated with zod when posts are listed. Invalid metadata, duplicate translations, language mismatches and published posts marked `draft: true` throw errors. The indexes and static article route generation consume this list, so these errors fail the build.
- Drafts and unpublished assets stay in gitignored `content/drafts/`. The application never imports this directory. Publication includes deliberately moving approved content and assets and registering the published translation.
- `@next/mdx` compiles imported modules through the normal Next.js pipeline. MDX is not added to `pageExtensions`.
- `next.config.ts` references `src/lib/blog/rehype.mjs` through a single-element plugin tuple containing an absolute filesystem path constructed with `path.join(process.cwd(), ...)`. The MDX loader resolves relative paths from the source context, not necessarily the repository root. Its `require.resolve` call does not accept a file URL as a module identifier.
- All function-based Shiki configuration stays inside the local plugin. Only a serializable string crosses the Turbopack configuration boundary.
- `@shikijs/rehype` highlights code at build time. `@shikijs/transformers` handles highlighted lines and diff annotations. The theme mapping is `dark` to `dark-plus`, `light` to `light-plus`, `monokai` to `monokai`, and `solarized-dark` to `solarized-dark`.
- Shiki emits CSS variables for all four themes. The reading styles will select them through the site's existing `data-theme` attribute. MDX renders highlighted tokens as React elements without `dangerouslySetInnerHTML`.
- There is no separate compiler, generated-module pipeline or content CI step.

Reading presentation (step 1c):

- The local plugin is the only rehype plugin. Before Shiki it assigns heading IDs and adds an `export const outline = [{ id, text, depth }]` to the MDX module, built as an ESTree node without extra dependencies. The registry validates `outline` with zod next to `metadata`. `@types/mdx` declares only the default export, so the registry types both named exports as optional and relies on that validation.
- Heading IDs transliterate German characters (`ä` to `ae`, `ö` to `oe`, `ü` to `ue`, `ß` to `ss`, uppercase too), strip other diacritics and become lowercase hyphenated slugs, so "Überstunden & Feierabend" becomes `#ueberstunden-feierabend`. Duplicates get `-1`, `-2` and so on. Authors set an explicit ID with a JSX heading, `<h2 id="custom-id">`, because `{#id}` is a JavaScript expression in MDX. Explicit IDs are claimed first and must be unique string literals. `main` is reserved for the skip link. The Outline lists h2 and h3 only; deeper headings keep their IDs.
- Code blocks stay normal fenced Markdown. A Shiki transformer in the plugin copies `filename="..."` and the language to data attributes, `defaultLanguage: 'text'` gives unlabelled blocks the same line structure, and the MDX component mapping supplies the frame and the copy button. Copy uses the rendered lines and skips removed diff lines.
- Shiki keeps each theme's own colours, except the token colours below WCAG AA (4.5:1) on that theme's background, which `colorReplacements` raises the least possible, reusing the adjusted values of `src/app/globals.css` where they exist. Highlighted and diff lines keep the theme background, because a tint would push more tokens below AA, and use a bar and a `+`/`-` sign instead.
- One client store measures the article body and its outlined headings per animation frame, on scroll, resize and body size changes. It feeds the Outline and the status bar, is reset when the article unmounts, and never moves focus or announces progress.

The published-post list supplies the indexes, static routes, sitemap and feeds. Both indexes show all published slugs, preferring the requested language and marking other-language posts. While the registry is empty, both indexes use `noindex, follow`; indexing starts automatically once a post exists.

Each published slug is prebuilt for both locales, including a localized notice when a translation is unavailable. Notices use `noindex, follow` and point their canonical to the available article. Article language alternates include published translations only, with English as `x-default` when available and German otherwise.

Unknown slugs follow the site's existing localized 404 pattern: keep the default `dynamicParams` and call `notFound()` from the page immediately after the validated registry lookup. Unknown requests render only the localized error, never article content. The page owns the `notFound()` call rather than relying on metadata error handling. This preserves the existing editor shell; `dynamicParams = false` is not used to select the localized error boundary.

The proxy has two next-intl handlers with identical routing options except `alternateLinks: false` on the journal handler. Only `/blog` and its descendants, after stripping a supported locale prefix, use that handler. Homepage and legal-page HTML alternates and automatic proxy headers stay unchanged. Journal metadata supplies its own accurate HTML alternates.

Journal locale switches reset the reading position to the top and use the existing raw Next.js router with the locale cookie. English URLs remain `/blog/...`, without an `/en` prefix. The notice's cross-language link sets the requested locale cookie before navigation so language detection cannot redirect back to the unavailable version.

Learning components (step 1d):

- An optional `content/posts/<slug>/learning.json` holds terms, sentences (German and English word-group alignment, authored explicitly), dialogues and quizzes, each keyed by a slug-format id. One file serves every translation of the slug; each registry entry references it with a `learning` loader next to `load`.
- `listPosts` parses the file once per translation with that translation's language. Reader-facing text is written as `{ "en": "...", "de": "..." }`, must exist in the parsing language and resolves to a plain string. Objects are strict, so step 1e adds audio fields deliberately. Sentence groups must match on both sides, dialogue speakers must be declared, and quiz choice ids must be unique and include the answer.
- MDX references entries by id: `<Term id="feierabend" />` (children override the displayed form), `<Gloss id="..." />`, `<Dialog id="..." />` and `<Quiz id="..." />`. The article page passes these four through the MDX `components` prop, bound to the post's validated data, so each client component receives one entry only. An unknown id, or a reference without a registered `learning.json`, throws during prerendering; every published slug is prebuilt, so the build fails.
- Callout (`note`, `tip`, `warning`), TLDR, Takeaways and Figure need no data and live in the global mapping. Figure takes a static image import from the MDX and renders a plain `<img>` with the intrinsic size: no layout shift, a hashed asset on the own origin and no image function. Authors export images at about twice the column width.
- Term uses the native Popover API (`popover="auto"`): a nonmodal disclosure with browser-provided Escape, light dismiss and focus return, which opens even before hydration. A small tested helper positions it next to the word.

Audio (step 1e):

- `pnpm audio <slug>` runs `scripts/generate-audio.ts` locally. It is a dry run by default: it lists new, copied and cached clips (file name, item, characters, model and voice on two short lines each), the characters and an upper-bound credit estimate (one credit per character); for a model without a published rate, such as `eleven_v4`, it says the credits are unknown instead of guessing. Observed on the Starter plan: 94 characters with `eleven_v4` cost about 38 credits (roughly 0.4 per character); this is a measurement, not a published rate, so the estimator does not use it. Only `--generate` calls ElevenLabs, through Node's built-in `fetch` and the `with-timestamps` endpoint, one clip at a time; it stops at the first error and a rerun resumes. `--draft` works in `content/drafts/<slug>/`, `--only` limits the kind, `--model` replaces every voice's model for samples, `--prune` lists unused clips and deletes them only together with `--generate`. Kamyar runs every `--generate` himself.
- `ELEVENLABS_API_KEY` lives only in the gitignored `.env.local`, loaded by Node's `--env-file-if-exists`. The script sends it only in the `xi-api-key` header and never prints it; errors carry the status and ElevenLabs' message with the key scrubbed. Builds, tests and Netlify never need it.
- Output format (`mp3_44100_128`), language, seed, voice settings and the voices are plain values in `src/lib/blog/audio-config.ts`. Each voice is an id plus its model, so every voice can use the model that suits it best; the model stays part of each clip's hash. After comparing multilingual v2, Flash v2.5 and Eleven v4 samples of both voices, every voice uses `eleven_v4`, which sounded the most natural in German. The voices are Voice Library voices, not the Default voices, which expire on 31 December 2026. Clips already generated stay usable; generating new clips depends on each voice's notice period, so a voice that is withdrawn means regenerating the affected clips with another one. The narrator voice speaks terms and Gloss sentences; dialogue speakers take the configured speaker voices in declaration order (the first speaker shares the narrator voice), with the narrator as fallback. `language_code` is sent to Flash and Turbo v2.5 and to Eleven v4 (`eleven_v4`, `eleven_v4_turbo`, which list German among their languages), never to multilingual v2, which does not support it. Eleven v4 uses only Stability and Similarity; its docs list no Style or Speed, so only `stability` and `similarity_boost` are sent and hashed for it. The docs do not state whether the `with-timestamps` endpoint returns alignment for v4. In practice it does: all four `eleven_v4` sample clips (a term, a Gloss sentence and two dialogue lines, both voices) came back with character timing that matched the sent text exactly, so they were stored with timing, and the sample sentence maps cleanly onto its Gloss groups. A clip without alignment would still be stored and play, only without Gloss highlighting.
- Only German is voiced: each term's German form, each Gloss sentence and each dialogue line. The cache key is the first 16 hex characters of a SHA-256 over a format version, text, language, voice id, model, the sorted settings sent for that model, output format and seed. Clips are named by it: `public/blog-audio/<slug>/<hash>.mp3` when published, `content/drafts/<slug>/audio/<hash>.mp3` for drafts. An identical clip in another post or draft is copied instead of generated.
- The script records each clip in `audio.json` next to `learning.json` (text, model, voice and optional timing), formatted with the repository's Prettier settings. The registry loads it with a third optional loader and validates it with zod. The page computes each item's hash from the current text and config and offers a file only when the manifest lists that hash, so changed text never plays stale audio. A test checks that every published manifest entry has its MP3.
- Timing is kept only when `alignment.characters` joins to exactly the sent text, as start and end milliseconds per character. Gloss sums it per aligned segment and highlights the spoken group while its clip plays; nothing else uses timing.
- Playback uses one native `<audio preload="none">` per button: nothing loads before a click, nothing autoplays, files are same-origin and covered by `default-src 'self'`. One clip plays at a time. Without a listed or loadable clip, a click speaks the text through `speechSynthesis` only with a voice whose `localService` is true and whose language is German; otherwise the button stays focusable with `aria-disabled` and says that audio is unavailable. Clips are served with a one-year immutable cache header, which is safe because their names change with their content.

Search and syndication (step 1f):

- Metadata is checked for search results: a title of at most 60 characters and a description of 70 to 160, so an overlong value fails the build. Article pages use "Title | kamycoding" as the document title, like the index, and the bare title for Open Graph and Twitter.
- The sitemap lists the home pages, both journal indexes once a post exists (the same condition as their `robots` tag) and every published translation. `lastmod` is `updated` or `date`, for an index the newest of its posts. Alternates name only translations that exist, with English as `x-default` when available. Notices, empty indexes and legal pages are never listed.
- One RSS 2.0 feed per language contains only that language's translations and is valid with no items. The proxy matcher skips every path with a dot, so `/blog/rss.xml` is never rewritten to `/en/...`: the English feed is a static route in `app/blog/rss.xml`, the German one lives in `app/[locale]/blog/rss.xml` for `de` only, and `/en/blog/rss.xml` stays a 404. Index and article pages link their language's feed through `alternates.types`.
- Every published translation gets a static Open Graph image at `/[locale]/blog/[slug]/og.png`, a route handler rather than `opengraph-image.tsx`, because that file convention adds its tags to every page of the segment, missing-translation notices included: the homepage image's frame (shared in `src/components/og/frame.tsx`, homepage output byte-identical) with a blueprint sheet of the title, its category, file name, date and language. Fonts come from the `geist` package, so building it makes no request. Satori measures some Geist words wider than it draws them, which leaves uneven gaps, so the title is set in at most two balanced lines whose words are joined by no-break spaces, at the largest size (64, 56 or 48px) where every line fits; widths come from the font file's own advance widths (`src/components/og/metrics.ts`, `title.ts`). A title that cannot fit two lines wraps normally. Article metadata names it for `og:image`, `twitter:image` and the JSON-LD `image`; articles have `og:type` `article` with published and modified times. Notices have no image.
- Article pages carry one JSON-LD graph with BlogPosting, BreadcrumbList and Person (name, role as the site shows it, GitHub and LinkedIn). React writes script text unchanged, so it needs no `dangerouslySetInnerHTML`; every `<` is escaped as `\u003c`. Notices carry none. DefinedTerm markup for glossary terms is a Phase 2 idea.
- Each article ends with an author box inside the article's `<footer>`: name, role and location in the site's own wording, and the GitHub and LinkedIn links. It sits outside the measured body, so it never counts as reading progress.

## Consequences

- Content uses the existing Next.js development and deployment workflow.
- New translations require an explicit registry entry. The registry remains empty until Kamyar supplies article content.
- Drafts stay out of GitHub and outside the application import graph. Gitignore alone is not a build exclusion mechanism; keeping drafts out of imports is essential.
- MDX is trusted repository code and must be reviewed accordingly.
- The absolute plugin path and bundled theme mapping were verified with a temporary TypeScript page importing MDX, under Turbopack development and production builds. The temporary files were removed after verification.
- Site builds need no ElevenLabs credential and incur no synthesis charges.
- The CSP needs no third-party origins.
- Commercial audio use requires review of the actual ElevenLabs agreement before generation. Kamyar's Starter plan includes a commercial licence and API access.
- Changing the model, a voice or a setting regenerates every affected clip at its credit cost; the dry run shows that cost first.
- Phase 1 has no vocabulary basket or persistent learning state. Richer reading tools and discovery features remain in Phase 2.
- Search engines and feed readers see published translations only; publishing a post updates the sitemap, the feed and its image without further steps.
- A typo in a learning id or a missing translation of reader-facing text fails the build instead of shipping a broken component.
