import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import { learningSchemas } from './learning'
import { listPosts, POSTS, type PostRegistration } from './posts'

const Content = () => null

const metadata = {
  title: 'Registry fixture',
  description: 'Post registry validation fixture with a description long enough for search results.',
  date: '2026-11-10',
  category: 'learning',
  format: 'note',
  tags: [],
  draft: false,
  lang: 'en'
}

const outline = [{ id: 'intro', text: 'Intro', depth: 2 }]

const registration = (overrides: Partial<PostRegistration> = {}): PostRegistration => ({
  slug: 'fixture',
  lang: 'en',
  load: async () => ({ default: Content, metadata, outline }),
  ...overrides
})

const published = path.join(process.cwd(), 'content/posts')

// Vitest does not compile MDX, so the real registry is checked against the files instead of being loaded.
describe('the published registry', () => {
  it('registers every folder in content/posts, and nothing else', () => {
    const folders = existsSync(published) ? readdirSync(published).sort() : []

    expect([...new Set(POSTS.map(entry => entry.slug))].sort()).toEqual(folders)
  })

  it.each(POSTS.map(entry => [`${entry.slug}/${entry.lang}`, entry] as const))(
    '%s has its MDX file and valid learning data',
    (_, entry) => {
      const folder = path.join(published, entry.slug)
      const learning = path.join(folder, 'learning.json')

      expect(existsSync(path.join(folder, `${entry.lang}.mdx`))).toBe(true)
      expect(Boolean(entry.learning)).toBe(existsSync(learning))
      expect(Boolean(entry.audio)).toBe(existsSync(path.join(folder, 'audio.json')))

      if (!entry.learning) return

      const result = learningSchemas[entry.lang].safeParse(JSON.parse(readFileSync(learning, 'utf8')))

      expect(result.error?.message).toBeUndefined()
    }
  )
})

describe('listPosts', () => {
  it('validates metadata at listing time and preserves the MDX component', async () => {
    expect(await listPosts([registration()])).toEqual([
      { slug: 'fixture', metadata, outline, learning: null, audio: null, Content }
    ])
  })

  it('rejects a module without the generated outline export', async () => {
    const entry = registration({ load: async () => ({ default: Content, metadata, outline: undefined }) })

    await expect(listPosts([entry])).rejects.toThrow('Invalid outline for fixture/en.mdx')
  })

  it('fails instead of silently omitting a published draft', async () => {
    const entry = registration({
      load: async () => ({ default: Content, metadata: { ...metadata, draft: true }, outline })
    })

    await expect(listPosts([entry])).rejects.toThrow('Published posts cannot be drafts')
  })

  it('reports the translation identity when metadata is missing or invalid', async () => {
    const entry = registration({ load: async () => ({ default: Content, metadata: undefined, outline }) })

    await expect(listPosts([entry])).rejects.toThrow('Invalid metadata for fixture/en.mdx')
  })

  it('rejects a metadata language that disagrees with its registered translation', async () => {
    await expect(listPosts([registration({ lang: 'de' })])).rejects.toThrow('Language does not match')
  })

  it('rejects duplicate translations before executing imports', async () => {
    const load = vi.fn(async () => ({ default: Content, metadata, outline }))

    await expect(listPosts([registration({ load }), registration({ load })])).rejects.toThrow(
      'Duplicate published translation: fixture/en'
    )
    expect(load).not.toHaveBeenCalled()
  })

  it('rejects an invalid slug before executing its import', async () => {
    const load = vi.fn(async () => ({ default: Content, metadata, outline }))

    await expect(listPosts([registration({ slug: '../drafts', load })])).rejects.toThrow()
    expect(load).not.toHaveBeenCalled()
  })

  it('allows independently published translations and sorts by date with stable ties', async () => {
    const german = registration({
      lang: 'de',
      load: async () => ({ default: Content, metadata: { ...metadata, lang: 'de', date: '2026-11-09' }, outline })
    })

    const other = registration({ slug: 'another-fixture' })

    const posts = await listPosts([german, registration(), other])

    expect(posts.map(post => `${post.slug}/${post.metadata.lang}`)).toEqual([
      'another-fixture/en',
      'fixture/en',
      'fixture/de'
    ])
  })

  it('propagates import failures instead of returning an incomplete catalogue', async () => {
    const entry = registration({
      load: async () => {
        throw new Error('Fixture import failed')
      }
    })

    await expect(listPosts([entry])).rejects.toThrow('Fixture import failed')
  })

  it('resolves learning.json text to the language of each translation', async () => {
    const learning = async () => ({
      default: { terms: { feierabend: { de: 'der Feierabend', en: 'end of work', note: { en: 'Note', de: 'Notiz' } } } }
    })

    const german = registration({
      lang: 'de',
      load: async () => ({ default: Content, metadata: { ...metadata, lang: 'de' }, outline }),
      learning
    })

    const posts = await listPosts([registration({ learning }), german])

    expect(posts.map(post => post.learning?.terms?.feierabend.note)).toEqual(['Notiz', 'Note'])
  })

  it('names the translation when its learning.json lacks text in that language', async () => {
    const entry = registration({
      learning: async () => ({ default: { terms: { feierabend: { de: 'x', en: 'y', note: { de: 'Notiz' } } } } })
    })

    await expect(listPosts([entry])).rejects.toThrow('Invalid learning.json for fixture/en.mdx')
  })

  it('validates audio.json and names the translation when it is broken', async () => {
    const clips = { '0123456789abcdef': { text: 'Hallo.', model: 'model', voice: 'voice' } }
    const [post] = await listPosts([registration({ audio: async () => ({ default: { version: 1, clips } }) })])

    expect(post.audio).toEqual({ version: 1, clips })

    const broken = registration({ audio: async () => ({ default: { version: 2, clips } }) })

    await expect(listPosts([broken])).rejects.toThrow('Invalid audio.json for fixture/en.mdx')
  })
})
