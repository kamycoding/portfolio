# ADR 0008: Structured data and search visibility

- Status: Accepted
- Date: 2026-11-20

## Context

Search engines and AI search tools should understand who the site is about and find the journal. Three gaps stood in the way:

- The homepage had no structured data. Only the articles described a Person, with a small set of fields that lived inside the article graph.
- Article dates were calendar days (`2026-11-10`). Google recommends a full date and time with a time zone.
- The journal index used its short visible tagline as its search description, and articles did not link to each other.

Constraints from earlier decisions: pages stay static (ADR 0002), nothing is requested from another origin (ADR 0005), and the site states only confirmed facts (CLAUDE.md "Content facts").

## Options

1. **Leave the Person in the article graph and write a second one for the homepage.** Two descriptions of one entity drift apart over time. Rejected.
2. **One shared Person with a fixed `@id`, used by every graph.** Each page describes the same entity, and a test compares the two graphs.
3. **A separate `/about` page as the ProfilePage.** The homepage already is the profile; another page would repeat it. Overengineering.

For crawlers:

1. **Bot-specific rules in `robots.txt` and an `llms.txt`.** `llms.txt` is not a standard that the large crawlers are known to follow, and per-bot rules have to be maintained as bots come and go.
2. **Allow everything and serve the content as HTML.** Nothing to maintain, and it works for every crawler, including those that do not run JavaScript.

## Decision

Option 2 in both cases.

- `src/lib/structured-data.ts` defines the Person once (`personNode`, `@id` `https://kamycoding.com/#person`): name, URL, role, the homepage meta description, the portrait of the about section, the public email address, GitHub and LinkedIn, five topics and an address with state (North Rhine-Westphalia) and country only. Nothing in it goes beyond what Kamyar has confirmed.
- The homepage of each language carries one JSON-LD graph: ProfilePage (its `mainEntity` is the Person), the Person, and WebSite (`kamycoding`, both languages, published by the Person). It uses the existing `JsonLd` component, so the rules of ADR 0005 still hold.
- The article graph (ADR 0007) uses the same `personNode`. Its `datePublished` and `dateModified` are midnight in Germany with the offset of that day (`2026-11-10T00:00:00+01:00`, `+02:00` in summer time), computed by `src/lib/blog/dates.ts`. The MDX files keep plain calendar days. The Open Graph article times use the same values.
- An article's document title gets " | kamycoding" only while the full title stays within 60 characters (`documentTitle` in `src/lib/site.ts`); otherwise it is the bare article title. The layouts define no Next.js title template, so a plain string is enough and `title.absolute` is not needed.
- The sitemap names `x-default` (English) for the homepages and the journal indexes, like their HTML.
- The journal indexes have their own search title and description (`journal.meta` in the message files) for the title, the meta description, Open Graph and Twitter. The visible tagline and the feed name (`journal.feedTitle`) are unchanged.
- Each article ends with "Keep reading": up to two other posts as article cards, never the current one. Posts in the page language come first; a post that exists only in the other language fills a free place and keeps its language label. The block sits after the article element, outside the measured body, so it is neither in the Outline nor part of the reading progress.
- `robots.txt` keeps allowing everything, with the sitemap line and no bot-specific rules. There is no `llms.txt`.

## Consequences

- A new fact about Kamyar is added in one place and reaches every page. A fact that is not in the content facts does not belong there.
- Google's Rich Results Test should report a profile page on the homepages and an article plus breadcrumbs on article pages. Person and WebSite are not rich result types of their own; the Schema Markup Validator lists them.
- If the portrait file is renamed, `personNode` has to follow. A test checks that the file exists.
- Calendar days stay the source of truth, so a post published on one day keeps that day in every time zone.
- Article text, headings and most component text are in the server HTML. A few texts still appear only after an interaction: quiz and puzzle explanations and the later steps of the stepper. Crawlers that do not run JavaScript miss those; putting them into the HTML is an open follow-up.
- This ADR is small and could have been an addendum, but ADR 0007 is about the journal and the Person and the homepage graph are site-wide.
