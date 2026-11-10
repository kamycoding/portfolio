import { describe, expect, it, vi } from 'vitest'

import { synthesize, timingFromAlignment } from './elevenlabs'

const apiKey = 'test-key-123'
const text = 'Hallo.'
const settings = { stability: 0.5, similarity_boost: 0.75 }

const alignment = {
  characters: [...text],
  character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
  character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
}

const request = {
  text,
  voiceId: 'voice id',
  model: 'eleven_v4',
  settings,
  outputFormat: 'mp3_44100_128',
  seed: 1,
  apiKey
}

const ok = (body: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))

describe('synthesize', () => {
  it('posts exactly the given values to the timestamps endpoint, with the key only in its header', async () => {
    const fetch = ok({ audio_base64: Buffer.from('mp3').toString('base64'), alignment })
    const result = await synthesize({ ...request, languageCode: 'de', fetch })
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]

    expect(url).toBe(
      'https://api.elevenlabs.io/v1/text-to-speech/voice%20id/with-timestamps?output_format=mp3_44100_128'
    )
    expect(init.headers).toMatchObject({ 'xi-api-key': apiKey })
    expect(url).not.toContain(apiKey)
    expect(init.body).not.toContain(apiKey)
    expect(JSON.parse(init.body as string)).toEqual({
      text,
      model_id: 'eleven_v4',
      voice_settings: settings,
      seed: 1,
      language_code: 'de'
    })
    expect(result.audio.toString()).toBe('mp3')
    expect(result.timing).toEqual({ start: [0, 100, 200, 300, 400, 500], end: [100, 200, 300, 400, 500, 600] })
  })

  it('leaves language_code out when none is given', async () => {
    const fetch = ok({ audio_base64: 'AA==' })

    await synthesize({ ...request, fetch })

    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]

    expect(JSON.parse(init.body as string)).not.toHaveProperty('language_code')
  })

  it('returns no timing when the response has no alignment', async () => {
    expect((await synthesize({ ...request, fetch: ok({ audio_base64: 'AA==' }) })).timing).toBeUndefined()
  })

  it('reports the status and message, never the key', async () => {
    const fetch = vi.fn(
      async () => new Response(JSON.stringify({ detail: { message: `Invalid key ${apiKey}` } }), { status: 401 })
    )

    const error = await synthesize({ ...request, fetch }).catch((caught: Error) => caught)

    expect((error as Error).message).toBe('ElevenLabs answered 401: Invalid key [redacted]')
  })
})

describe('timingFromAlignment', () => {
  it('drops timing that does not map one to one onto the sent text', () => {
    expect(timingFromAlignment({ ...alignment, characters: [...'Hallo!'] }, text)).toBeUndefined()
    expect(timingFromAlignment({ ...alignment, character_end_times_seconds: [0.1] }, text)).toBeUndefined()
  })
})
