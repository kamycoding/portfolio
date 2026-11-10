import { describe, expect, it, vi } from 'vitest'

import { listPosts, type PostRegistration } from './posts'

const Content = () => null

const metadata = {
  title: 'Registry fixture',
  description: 'Post registry validation fixture.',
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

describe('listPosts', () => {
  it('starts with no published content', async () => {
    expect(await listPosts()).toEqual([])
  })

  it('validates metadata at listing time and preserves the MDX component', async () => {
    expect(await listPosts([registration()])).toEqual([{ slug: 'fixture', metadata, outline, Content }])
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
})
