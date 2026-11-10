// Local audio authoring for journal posts (docs/adr/0007). A dry run by default: only --generate calls ElevenLabs.
// The API key comes from ELEVENLABS_API_KEY (loaded from .env.local by `pnpm audio`) and is never printed.
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { format, resolveConfig } from 'prettier'

import {
  type AudioItem,
  type AudioManifest,
  audioItems,
  audioManifestSchema,
  estimateCredits,
  requestSettings,
  sendsLanguageCode,
  withModel
} from '../src/lib/blog/audio.ts'
import { audioConfig } from '../src/lib/blog/audio-config.ts'
import { synthesize } from '../src/lib/blog/elevenlabs.ts'
import { learningSchemas } from '../src/lib/blog/learning.ts'

const usage = `Usage: pnpm audio <slug> [--draft] [--only term|gloss|dialog] [--model <id>] [--prune] [--generate]

  --draft      read and write content/drafts/<slug>/ instead of the published post
  --only       limit to one kind of clip
  --model      use this model for every voice instead of the per-voice models (for samples)
  --prune      list clips that are no longer referenced; deletes them together with --generate
  --generate   call ElevenLabs for new clips (without it, nothing leaves this machine)`

const fail = (message: string): never => {
  console.error(`[audio] ${message}`)
  process.exit(1)
}

const { values, positionals } = (() => {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        draft: { type: 'boolean', default: false },
        generate: { type: 'boolean', default: false },
        prune: { type: 'boolean', default: false },
        only: { type: 'string' },
        model: { type: 'string' }
      }
    })
  } catch (error) {
    return fail(`${(error as Error).message}\n\n${usage}`)
  }
})()

const slug = positionals[0]

if (positionals.length !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(usage)
if (values.only && !['term', 'gloss', 'dialog'].includes(values.only)) fail(usage)
if (values.model && !/^[a-z0-9_]+$/.test(values.model)) fail(`Unexpected model id "${values.model}".`)

const config = values.model ? withModel(audioConfig, values.model) : audioConfig
const root = path.resolve(import.meta.dirname, '..')
const relative = (file: string) => path.relative(root, file)

// Published clips are served from public/; draft clips stay in the gitignored drafts folder.
const folders = (draft: boolean, name: string) =>
  draft
    ? { source: path.join(root, 'content/drafts', name), clips: path.join(root, 'content/drafts', name, 'audio') }
    : { source: path.join(root, 'content/posts', name), clips: path.join(root, 'public/blog-audio', name) }

const target = folders(values.draft, slug)
const manifestFile = path.join(target.source, 'audio.json')
const clipFile = (clips: string, hash: string) => path.join(clips, `${hash}.mp3`)

const readManifest = async (file: string): Promise<AudioManifest> => {
  if (!existsSync(file)) return { version: 1, clips: {} }

  const result = audioManifestSchema.safeParse(JSON.parse(await readFile(file, 'utf8')))

  return result.success ? result.data : fail(`Invalid ${relative(file)}: ${result.error.message}`)
}

const learningFile = path.join(target.source, 'learning.json')

if (!existsSync(learningFile)) fail(`No learning.json in ${relative(target.source)}.`)

// learning.json is parsed with the language of an existing translation; the voiced German text is the same for all.
const language = ['en', 'de'].find(lang => existsSync(path.join(target.source, `${lang}.mdx`))) ?? 'en'
const learning = learningSchemas[language as 'en' | 'de'].safeParse(JSON.parse(await readFile(learningFile, 'utf8')))

if (!learning.success) fail(`Invalid ${relative(learningFile)}: ${learning.error.message}`)

const manifest = await readManifest(manifestFile)
const all = audioItems(learning.data!, config)
const items = all.filter(item => !values.only || item.kind === values.only)

// Other posts and drafts may already hold an identical clip; copying it costs nothing.
const findCopy = async (hash: string) => {
  for (const draft of [false, true]) {
    const base = path.join(root, draft ? 'content/drafts' : 'content/posts')
    const names = existsSync(base) ? await readdir(base) : []

    for (const name of names) {
      const other = folders(draft, name)

      if (other.source === target.source) continue

      const entry = (await readManifest(path.join(other.source, 'audio.json'))).clips[hash]

      if (entry && existsSync(clipFile(other.clips, hash))) return { file: clipFile(other.clips, hash), entry }
    }
  }

  return undefined
}

type Planned = AudioItem & Readonly<{ status: 'cached' | 'copy' | 'new'; copy?: Awaited<ReturnType<typeof findCopy>> }>

const planned: Planned[] = []

for (const item of items) {
  if (manifest.clips[item.hash] && existsSync(clipFile(target.clips, item.hash))) {
    planned.push({ ...item, status: 'cached' })
    continue
  }

  const copy = await findCopy(item.hash)

  planned.push({ ...item, status: copy ? 'copy' : 'new', copy })
}

// Orphans are judged against every clip of the post, so --only never marks the other kinds as unused.
const referenced = new Set(all.map(item => item.hash))
const files = existsSync(target.clips) ? await readdir(target.clips) : []

const orphans = [
  ...new Set([
    ...Object.keys(manifest.clips),
    ...files.filter(file => file.endsWith('.mp3')).map(file => file.slice(0, -4))
  ])
].filter(hash => !referenced.has(hash))

const fresh = planned.filter(item => item.status === 'new')
const estimate = estimateCredits(fresh)

const cost = estimate.unknown.length
  ? `credits unknown: no published rate for ${estimate.unknown.join(', ')}`
  : `at most ${estimate.credits} credits`

console.info(`[audio] ${slug} (${values.draft ? 'draft' : 'published'}), clips in ${relative(target.clips)}/`)
if (values.model) console.info(`[audio] --model ${values.model} replaces the per-voice models.`)

// Two short lines per clip, so nothing runs together when a narrow terminal wraps.
for (const item of planned) {
  console.info(`  ${item.status.padEnd(7)} ${item.hash}.mp3  ${item.kind} ${item.id}, ${item.text.length} chars`)
  console.info(`          model ${item.voice.model}, voice ${item.voice.id || 'missing'}`)
}

if (values.prune) for (const hash of orphans) console.info(`  unused  ${hash}.mp3`)

console.info(
  `[audio] ${fresh.length} new (${estimate.characters} characters, ${cost}), ` +
    `${planned.filter(item => item.status === 'copy').length} copied, ` +
    `${planned.filter(item => item.status === 'cached').length} cached` +
    (orphans.length ? `, ${orphans.length} unused${values.prune ? '' : ' (see --prune)'}` : '') +
    '.'
)

if (!values.generate) {
  console.info('[audio] Dry run: nothing was generated or deleted. Add --generate to call ElevenLabs.')
  process.exit(0)
}

const apiKey = process.env.ELEVENLABS_API_KEY ?? ''

if (fresh.length > 0 && !apiKey) fail('ELEVENLABS_API_KEY is not set. Add it to .env.local; it is never printed.')
if (fresh.some(item => !item.voice.id)) fail('A voice id is missing in src/lib/blog/audio-config.ts.')

// The manifest is rewritten after every clip, so an interrupted run resumes from the cache.
const prettier = await resolveConfig(manifestFile)

const saveManifest = async () => {
  const clips = Object.fromEntries(Object.entries(manifest.clips).sort(([a], [b]) => a.localeCompare(b)))
  const json = await format(JSON.stringify({ ...manifest, clips }), { ...prettier, parser: 'json' })

  await writeFile(`${manifestFile}.tmp`, json)
  await rename(`${manifestFile}.tmp`, manifestFile)
}

await mkdir(target.clips, { recursive: true })

for (const item of planned) {
  const file = clipFile(target.clips, item.hash)

  if (item.status === 'copy') {
    await copyFile(item.copy!.file, file)
    manifest.clips[item.hash] = item.copy!.entry
  }

  if (item.status === 'new') {
    try {
      const { audio, timing } = await synthesize({
        text: item.text,
        voiceId: item.voice.id,
        model: item.voice.model,
        settings: requestSettings(item.voice.model, config.settings),
        languageCode: sendsLanguageCode(item.voice.model) ? config.language : undefined,
        outputFormat: config.outputFormat,
        seed: config.seed,
        apiKey,
        fetch
      })

      await writeFile(`${file}.tmp`, audio)
      await rename(`${file}.tmp`, file)
      manifest.clips[item.hash] = {
        text: item.text,
        model: item.voice.model,
        voice: item.voice.id,
        ...(timing && { timing })
      }

      if (!timing)
        console.warn(`[audio] No reliable timing for ${item.kind} ${item.id}; it plays without highlighting.`)
    } catch (error) {
      await saveManifest()
      fail(`Stopped at ${item.kind} ${item.id}: ${(error as Error).message}`)
    }
  }

  if (item.status !== 'cached') {
    await saveManifest()
    console.info(`[audio] ${item.status === 'copy' ? 'copied' : 'generated'} ${item.kind} ${item.id}`)
  }
}

if (values.prune && orphans.length) {
  for (const hash of orphans) {
    await rm(clipFile(target.clips, hash), { force: true })
    delete manifest.clips[hash]
  }

  await saveManifest()
  console.info(`[audio] Deleted ${orphans.length} unused clip(s).`)
}

console.info('[audio] Done.')
