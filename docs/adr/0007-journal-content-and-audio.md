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
- A small registry explicitly imports published translations. Metadata is validated with zod when posts are listed. Invalid metadata, duplicate translations, language mismatches and published posts marked `draft: true` throw errors. Static route generation will consume this list in step 1b so these errors fail the build.
- Drafts and unpublished assets stay in gitignored `content/drafts/`. The application never imports this directory. Publication includes deliberately moving approved content and assets and registering the published translation.
- `@next/mdx` compiles imported modules through the normal Next.js pipeline. MDX is not added to `pageExtensions`.
- `next.config.ts` references `src/lib/blog/rehype.mjs` through a single-element plugin tuple containing an absolute filesystem path constructed with `path.join(process.cwd(), ...)`. The MDX loader resolves relative paths from the source context, not necessarily the repository root. Its `require.resolve` call does not accept a file URL as a module identifier.
- All function-based Shiki configuration stays inside the local plugin. Only a serializable string crosses the Turbopack configuration boundary.
- `@shikijs/rehype` highlights code at build time. `@shikijs/transformers` handles highlighted lines and diff annotations. The theme mapping is `dark` to `dark-plus`, `light` to `light-plus`, `monokai` to `monokai`, and `solarized-dark` to `solarized-dark`.
- Shiki emits CSS variables for all four themes. The reading styles will select them through the site's existing `data-theme` attribute. MDX renders highlighted tokens as React elements without `dangerouslySetInnerHTML`.
- There is no separate compiler, generated-module pipeline or content CI step.

The published-post list will supply the indexes, static routes, sitemap and RSS. Missing translations will render a localized notice linking to an available version. Language alternates will include published translations only. Journal-only suppression of automatic proxy alternate headers is deferred to step 1b.

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
