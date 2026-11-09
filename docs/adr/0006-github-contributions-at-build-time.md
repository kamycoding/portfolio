# ADR 0006: GitHub contributions at build time

- Status: Accepted
- Date: 2026-11-09

## Context

The stack section shows a contribution heatmap. Until v2.0.0 it showed static data: the 168 commits of the v1 history of this repository. It should show the real GitHub activity of `kamycoding`, like GitHub's own graph, in the same design.

Constraints from earlier decisions:

- Pages are static and served from the Netlify CDN; there is no separate backend (ADR 0002).
- The Content Security Policy only allows connections to the own origin (ADR 0005).
- The GitHub GraphQL API needs a token, even for public data, and a token must never reach the browser or the repository.

## Options

1. **Fetch in the browser.** Needs a token in the client or a proxy function, a CSP change for `api.github.com`, and runs into rate limits. Rejected.
2. **Fetch at request time** (a Netlify function or on-demand regeneration). Pages stop being purely static and every cache miss calls GitHub. Overengineering for data that changes once a day.
3. **Fetch at build time** and refresh with a daily rebuild. Pages stay static, the CSP stays unchanged, the token only exists in the build.
4. **A bot that commits a fresh snapshot every day.** The `main` ruleset requires pull requests, and the history would fill with data commits. Rejected.

## Decision

Option 3.

- `pnpm build` runs `scripts/fetch-contributions.ts` before `next build`. It asks the GitHub GraphQL API for the contribution calendar of `kamycoding`, 17 weeks ending the current week (Monday-first columns, as in the grid), with GitHub's own levels (`contributionLevel`).
- The response is validated with zod and written to `src/content/contributions.json`. The pages read that file at build time.
- **Fallback:** the committed `contributions.json` is the snapshot. Without a token, on an HTTP or GraphQL error, an unexpected response, an empty calendar, a network error or a 10 second timeout, the script keeps the snapshot, logs one warning and exits successfully. The build never fails because of GitHub.
- **Token:** a fine-grained personal access token with access to public repositories only (read-only) and no permissions. It is stored in Netlify as a secret variable `GITHUB_CONTRIBUTIONS_TOKEN` for the **Production context only**. Deploy Previews and branch deploys, including Dependabot pull requests, do not get it and build from the snapshot, so the token never reaches builds of untrusted dependency updates. The script never prints it, and it never reaches the client bundle.
- **Scopes:** the Netlify free plan cannot restrict a variable to the Builds scope, so the token also has the default Functions and Runtime scopes. Only the build script reads it; the contact function never reads or logs it. If the plan changes, limit it to Builds.
- **Daily refresh:** `.github/workflows/refresh-contributions.yml` runs at 03:00 UTC and calls a Netlify build hook for `main`. The hook URL is the repository secret `NETLIFY_BUILD_HOOK_URL`. The workflow uses no third-party actions and has no token permissions.
- The heatmap says "contributions" / "Beiträge", because GitHub counts commits, pull requests, issues and reviews.

## Consequences

- Pages stay static and CDN-cached, and the CSP is unchanged.
- Production shows data at most a day old. Previews show the committed snapshot, which can be older.
- Maintenance: fine-grained tokens expire after at most one year. An expired token does not break anything (the snapshot is used and the build log warns), but it has to be renewed. Refresh the committed snapshot now and then with `pnpm contributions:update`, so the fallback stays close to reality.
- GitHub pauses scheduled workflows in public repositories after 60 days without repository activity; it sends an email, and one click re-enables the workflow.
- One extra production build per day.
- The token sees public repositories only, so the heatmap counts public contributions. The profile graph also counts private ones: at the first snapshot (20 July to 9 November 2026) it showed 606 against 531 here. Widening the token to all repositories (metadata only) would likely close the gap; it was left narrow on purpose.
