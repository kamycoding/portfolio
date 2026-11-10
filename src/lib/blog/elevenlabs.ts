import { z } from 'zod'

import type { AudioConfig, AudioTiming } from './audio'

const ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech'

// The API ignores language_code for multilingual v2, so it is only sent where it enforces German.
const LANGUAGE_CODE_MODELS = new Set(['eleven_flash_v2_5', 'eleven_turbo_v2_5'])

const alignmentSchema = z.object({
  characters: z.array(z.string()),
  character_start_times_seconds: z.array(z.number()),
  character_end_times_seconds: z.array(z.number())
})

const responseSchema = z.object({ audio_base64: z.string().min(1), alignment: alignmentSchema.nullish() })

// Timing is kept only when it maps one to one onto the text that was sent, so the page can trust every index.
export const timingFromAlignment = (
  alignment: z.infer<typeof alignmentSchema>,
  text: string
): AudioTiming | undefined => {
  const { characters, character_start_times_seconds: start, character_end_times_seconds: end } = alignment

  if (characters.join('') !== text || characters.length !== text.length) return undefined
  if (start.length !== text.length || end.length !== text.length) return undefined

  return { start: start.map(s => Math.round(s * 1000)), end: end.map(s => Math.round(s * 1000)) }
}

type SynthesizeOptions = Readonly<{
  text: string
  voice: string
  config: AudioConfig
  apiKey: string
  fetch: typeof globalThis.fetch
}>

// Errors carry the status and ElevenLabs' message only; the key is scrubbed in case a response ever echoes it.
const failure = async (response: Response, apiKey: string) => {
  let detail = response.statusText

  try {
    const body = (await response.json()) as { detail?: string | { message?: string } }

    detail = typeof body.detail === 'string' ? body.detail : (body.detail?.message ?? detail)
  } catch {
    // Not JSON: keep the status text.
  }

  return new Error(`ElevenLabs answered ${response.status}: ${detail.replaceAll(apiKey, '[redacted]').slice(0, 300)}`)
}

export const synthesize = async ({ text, voice, config, apiKey, fetch }: SynthesizeOptions) => {
  const url = `${ENDPOINT}/${encodeURIComponent(voice)}/with-timestamps?output_format=${encodeURIComponent(config.outputFormat)}`

  const body = {
    text,
    model_id: config.model,
    voice_settings: config.settings,
    seed: config.seed,
    ...(LANGUAGE_CODE_MODELS.has(config.model) && { language_code: config.language })
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000)
  })

  if (!response.ok) throw await failure(response, apiKey)

  const data = responseSchema.parse(await response.json())

  return {
    audio: Buffer.from(data.audio_base64, 'base64'),
    timing: data.alignment ? timingFromAlignment(data.alignment, text) : undefined
  }
}
