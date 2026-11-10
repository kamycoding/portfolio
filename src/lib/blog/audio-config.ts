import type { AudioConfig } from './audio'

/*
 * Plain configuration, not secrets (docs/adr/0007). Every value is part of the clip hash, so a change regenerates
 * the affected clips. The voices come from the Voice Library: generated clips stay usable, new clips depend on each
 * voice's notice period.
 */
export const audioConfig: AudioConfig = {
  model: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128',
  language: 'de',
  seed: 1,

  // ElevenLabs' defaults.
  settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
  voices: {
    narrator: 'vv3bG6FrcGtmeOdRSriS',

    // In the order a dialogue declares its speakers: the first speaker shares the narrator's voice.
    speakers: ['vv3bG6FrcGtmeOdRSriS', 'petid4zVzpITlltH2r3L']
  }
}
