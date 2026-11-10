import { clipHash, clipPath } from './audio'
import { audioConfig } from './audio-config'
import type { PublishedPost } from './posts'

export type NarrationSection = Readonly<{ id: string; title: string; src?: string }>

// The sections of a post's narration, in reading order. A section has a file only when audio.json lists the clip for
// its current text, voice and language (docs/adr/0007). Null when the post has no narration.
export const narrationSections = ({ slug, metadata, learning, audio, outline }: PublishedPost) => {
  const entries = learning?.narration

  if (!entries?.length) return null

  const voice = audioConfig.voices.narration[metadata.lang]

  return entries.map<NarrationSection>(({ heading, text }) => {
    const hash = clipHash(text, voice, audioConfig, metadata.lang)

    return {
      id: heading,
      title: outline.find(item => item.id === heading)?.text ?? heading,
      src: audio?.clips[hash] ? clipPath(slug, hash) : undefined
    }
  })
}
