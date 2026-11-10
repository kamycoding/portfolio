import type { AudioConfig } from './audio'

/*
 * Plain configuration, not secrets (docs/adr/0007). Every value is part of the clip hash, so a change regenerates
 * the affected clips. Voices are ElevenLabs replacement voices, never the Default voices that expire at the end of 2026.
 */
export const audioConfig: AudioConfig = {
  model: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128',
  language: 'de',
  seed: 1,

  // ElevenLabs' defaults.
  settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
  voices: {
    // Elara
    narrator: 'WQP7cQUF5aAS6Axh5yaa',

    // Eddie and Jade, in the order a dialogue declares its speakers.
    speakers: ['l7kNoIfnJKPg7779LI2t', 'g7LVvkPWALzPxOQbF6OE']
  }
}
