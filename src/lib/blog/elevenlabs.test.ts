import { describe, expect, it, vi } from 'vitest'

import type { AudioConfig } from './audio'
import { synthesize, timingFromAlignment } from './elevenlabs'

const config: AudioConfig = {
  model: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128',
  language: 'de',
  seed: 1,
  settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
  voices: { narrator: 'narrator', speakers: [] }
}

const apiKey = 'test-key-123'
const text = 'Hallo.'

const alignment = {
  characters: [...text],
  character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
  character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
}

const ok = (body: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))

describe('synthesize', () => {
  it('posts to the timestamps endpoint with the key only in its header', async () => {
    const fetch = ok({ audio_base64: Buffer.from('mp3').toString('base64'), alignment })
    const result = await synthesize({ text, voice: 'voice id', config, apiKey, fetch })
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    const body = JSON.parse(init.body as string)

    expect(url).toBe(
      'https://api.elevenlabs.io/v1/text-to-speech/voice%20id/with-timestamps?output_format=mp3_44100_128'
    )
    expect(init.headers).toMatchObject({ 'xi-api-key': apiKey })
    expect(url).not.toContain(apiKey)
    expect(init.body).not.toContain(apiKey)
    expect(body).toEqual({ text, model_id: config.model, voice_settings: config.settings, seed: 1 })
    expect(result.audio.toString()).toBe('mp3')
    expect(result.timing).toEqual({ start: [0, 100, 200, 300, 400, 500], end: [100, 200, 300, 400, 500, 600] })
  })

  it('sends language_code only to models that enforce it', async () => {
    const fetch = ok({ audio_base64: 'AA==' })

    await synthesize({ text, voice: 'v', config: { ...config, model: 'eleven_flash_v2_5' }, apiKey, fetch })

    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]

    expect(JSON.parse(init.body as string).language_code).toBe('de')
  })

  it('reports the status and message, never the key', async () => {
    const fetch = vi.fn(
      async () => new Response(JSON.stringify({ detail: { message: `Invalid key ${apiKey}` } }), { status: 401 })
    )

    const error = await synthesize({ text, voice: 'v', config, apiKey, fetch }).catch((caught: Error) => caught)

    expect((error as Error).message).toBe('ElevenLabs answered 401: Invalid key [redacted]')
  })
})

describe('timingFromAlignment', () => {
  it('drops timing that does not map one to one onto the sent text', () => {
    expect(timingFromAlignment({ ...alignment, characters: [...'Hallo!'] }, text)).toBeUndefined()
    expect(timingFromAlignment({ ...alignment, character_end_times_seconds: [0.1] }, text)).toBeUndefined()
  })
})
