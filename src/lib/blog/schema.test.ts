import { describe, expect, it } from 'vitest'

import { postMetadataSchema, postSlugSchema } from './schema'

const metadata = {
  title: 'Schema fixture',
  description: 'Metadata validation fixture.',
  date: '2026-11-10',
  category: 'engineering',
  format: 'note',
  tags: [],
  draft: false,
  lang: 'en'
}

describe('postMetadataSchema', () => {
  it('accepts minimal published metadata without inventing optional values', () => {
    expect(postMetadataSchema.parse(metadata)).toEqual(metadata)
  })

  it('trims prose fields and tags', () => {
    expect(postMetadataSchema.parse({ ...metadata, title: ' Fixture ', tags: [' typescript '] })).toMatchObject({
      title: 'Fixture',
      tags: ['typescript']
    })
  })

  it.each([true, undefined, 'false'])('rejects draft value %s', draft => {
    expect(postMetadataSchema.safeParse({ ...metadata, draft }).success).toBe(false)
  })

  it.each(['2026-02-29', '2026-04-31', '10/11/2026', '2026-11-10T00:00:00Z'])(
    'rejects invalid publication date %s',
    date => {
      expect(postMetadataSchema.safeParse({ ...metadata, date }).success).toBe(false)
    }
  )

  it('accepts leap days and rejects invalid or earlier update dates', () => {
    expect(postMetadataSchema.safeParse({ ...metadata, date: '2024-02-29' }).success).toBe(true)
    expect(postMetadataSchema.safeParse({ ...metadata, updated: '2026-11-10' }).success).toBe(true)
    expect(postMetadataSchema.safeParse({ ...metadata, updated: '2026-11-09' }).success).toBe(false)
    expect(postMetadataSchema.safeParse({ ...metadata, updated: '2026-02-30' }).success).toBe(false)
  })

  it('requires a stable series identifier for series posts', () => {
    expect(postMetadataSchema.safeParse({ ...metadata, format: 'series' }).success).toBe(false)
    expect(postMetadataSchema.safeParse({ ...metadata, format: 'series', series: 'fixture-series' }).success).toBe(true)
    expect(postMetadataSchema.safeParse({ ...metadata, series: '../drafts' }).success).toBe(false)
  })

  it('rejects unknown fields, empty prose and duplicate normalized tags', () => {
    expect(postMetadataSchema.safeParse({ ...metadata, typo: true }).success).toBe(false)
    expect(postMetadataSchema.safeParse({ ...metadata, title: ' ' }).success).toBe(false)
    expect(postMetadataSchema.safeParse({ ...metadata, description: '' }).success).toBe(false)
    expect(postMetadataSchema.safeParse({ ...metadata, tags: [' '] }).success).toBe(false)
    expect(postMetadataSchema.safeParse({ ...metadata, tags: ['typescript', ' typescript '] }).success).toBe(false)
  })

  it.each([{ category: 'unknown' }, { format: 'unknown' }, { lang: 'fr' }])(
    'rejects unsupported metadata values %j',
    invalid => {
      expect(postMetadataSchema.safeParse({ ...metadata, ...invalid }).success).toBe(false)
    }
  )
})

describe('postSlugSchema', () => {
  it.each(['../drafts', 'post/name', 'Post', 'two words', '-post', 'post-', 'two--words', ''])(
    'rejects unsafe or ambiguous slug %s',
    slug => {
      expect(postSlugSchema.safeParse(slug).success).toBe(false)
    }
  )

  it('accepts lowercase slugs with digits and hyphens', () => {
    expect(postSlugSchema.parse('fixture-1')).toBe('fixture-1')
  })
})
