import type { AudioConfig } from './audio'

/*
 * Plain configuration, not secrets (docs/adr/0007). Every value is part of the clip hash, so a change regenerates
 * the affected clips. The voices come from the Voice Library: generated clips stay usable, new clips depend on each
 * voice's notice period.
 */
export const audioConfig: AudioConfig = {
  outputFormat: 'mp3_44100_128',
  language: 'de',
  seed: 1,

  // ElevenLabs' defaults. Eleven v4 receives only stability and similarity_boost (requestSettings in audio.ts).
  settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },

  // Each voice with the model that suits it best; `pnpm audio --model` overrides all of them for samples.
  voices: {
    narrator: { id: 'vv3bG6FrcGtmeOdRSriS', model: 'eleven_v4' },

    // In the order a dialogue declares its speakers: the first speaker shares the narrator's voice.
    speakers: [
      { id: 'vv3bG6FrcGtmeOdRSriS', model: 'eleven_v4' },
      { id: 'petid4zVzpITlltH2r3L', model: 'eleven_v4' }
    ],

    // Article narration: Lawrence (a permanent Voice Library voice) in English, the German narrator in German.
    narration: {
      en: { id: 'ktkP7Nsj67dw2zcplQYt', model: 'eleven_v4' },
      de: { id: 'vv3bG6FrcGtmeOdRSriS', model: 'eleven_v4' }
    }
  }
}
