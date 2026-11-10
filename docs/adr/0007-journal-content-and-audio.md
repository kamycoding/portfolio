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

The published-post list supplies the indexes and static routes. Sitemap and RSS integration follows in step 1f. Both indexes show all published slugs, preferring the requested language and marking other-language posts. While the registry is empty, both indexes use `noindex, follow`; indexing starts automatically once a post exists.

Each published slug is prebuilt for both locales, including a localized notice when a translation is unavailable. Notices use `noindex, follow` and point their canonical to the available article. Article language alternates include published translations only, with English as `x-default` when available and German otherwise.

Unknown slugs follow the site's existing localized 404 pattern: keep the default `dynamicParams` and call `notFound()` from the page immediately after the validated registry lookup. Unknown requests render only the localized error, never article content. The page owns the `notFound()` call rather than relying on metadata error handling. This preserves the existing editor shell; `dynamicParams = false` is not used to select the localized error boundary.

The proxy has two next-intl handlers with identical routing options except `alternateLinks: false` on the journal handler. Only `/blog` and its descendants, after stripping a supported locale prefix, use that handler. Homepage and legal-page HTML alternates and automatic proxy headers stay unchanged. Journal metadata supplies its own accurate HTML alternates.

Journal locale switches reset the reading position to the top and use the existing raw Next.js router with the locale cookie. English URLs remain `/blog/...`, without an `/en` prefix. The notice's cross-language link sets the requested locale cookie before navigation so language detection cannot redirect back to the unavailable version.

Optional `learning.json` files will hold validated terms, sentence alignment, dialogue and quiz data. German and English alignment is authored explicitly.

In step 1e, `scripts/generate-audio.ts` will call ElevenLabs during local authoring. The API key will exist only in an environment variable. Normal builds will not call ElevenLabs. The cache key will include text, language, voice, model, synthesis settings and output format. Published MP3 and timing files will be served from the own origin; unpublished audio will stay with local drafts.

Playback will use native audio elements. Timing information will be used only when it maps reliably to displayed text. Missing audio may use a local German Web Speech voice after a playback request. Remote voices will not be selected. The ElevenLabs plan remains unresolved, and generation requires Kamyar's voice choice and explicit approval.

## Consequences

- Content uses the existing Next.js development and deployment workflow.
- New translations require an explicit registry entry. The registry remains empty until Kamyar supplies article content.
- Drafts stay out of GitHub and outside the application import graph. Gitignore alone is not a build exclusion mechanism; keeping drafts out of imports is essential.
- MDX is trusted repository code and must be reviewed accordingly.
- The absolute plugin path and bundled theme mapping were verified with a temporary TypeScript page importing MDX, under Turbopack development and production builds. The temporary files were removed after verification.
- Site builds need no ElevenLabs credential and incur no synthesis charges.
- The CSP needs no third-party origins.
- Commercial audio use requires review of the actual ElevenLabs agreement before generation.
- Phase 1 has no vocabulary basket or persistent learning state. Richer reading tools and discovery features remain in Phase 2.
