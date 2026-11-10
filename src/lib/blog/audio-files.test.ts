import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { audioManifestSchema } from './audio'

const root = process.cwd()
const posts = path.join(root, 'content/posts')
const slugs = existsSync(posts) ? readdirSync(posts) : []
const manifests = slugs.filter(slug => existsSync(path.join(posts, slug, 'audio.json')))

// The page offers every clip a manifest lists, so a missing MP3 would be a broken play button.
describe('published audio', () => {
  it.each(manifests.length ? manifests : ['(none)'])('%s lists only clips that exist in public/', slug => {
    if (slug === '(none)') return

    const manifest = audioManifestSchema.parse(JSON.parse(readFileSync(path.join(posts, slug, 'audio.json'), 'utf8')))

    const missing = Object.keys(manifest.clips).filter(
      hash => !existsSync(path.join(root, 'public/blog-audio', slug, `${hash}.mp3`))
    )

    expect(missing).toEqual([])
  })
})
