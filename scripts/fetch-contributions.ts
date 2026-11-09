// Refreshes src/content/contributions.json (52 weeks, see WEEKS) from GitHub before `next build` (docs/adr/0006-github-contributions-at-build-time.md).
// Any failure keeps the committed snapshot and exits 0, so the build never breaks. The token is never printed.
import { writeFile } from 'node:fs/promises'

import { fetchSnapshot } from '../src/lib/contributions.ts'

const output = new URL('../src/content/contributions.json', import.meta.url)

const result = await fetchSnapshot({
  token: process.env.GITHUB_CONTRIBUTIONS_TOKEN,
  now: new Date(),
  fetch: globalThis.fetch
})

if (result.ok) {
  await writeFile(output, `${JSON.stringify(result.snapshot, null, 2)}\n`)

  const total = result.snapshot.days.reduce((sum, day) => sum + day.count, 0)

  console.info(`[contributions] ${total} contributions, ${result.snapshot.start} to ${result.snapshot.end}.`)
} else {
  console.warn(`[contributions] Using the committed snapshot (${result.reason}).`)
}
