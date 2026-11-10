import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { ReactNode } from 'react'

// Dark theme tokens from globals.css; the images have no CSS variables.
export const OG_COLOR = {
  bg: '#181818',
  text: '#cccccc',
  muted: '#9d9d9d',
  com: '#70a15a',
  kw: '#569cd6',
  hair: '#3c3c3c'
}

const font = (file: string) => readFile(join(process.cwd(), 'node_modules/geist/dist/fonts', file))

// Self-hosted Geist from node_modules, so building an image never makes a network request.
export const ogFonts = async () => {
  const [sans, sansSemiBold, mono] = await Promise.all([
    font('geist-sans/Geist-Regular.ttf'),
    font('geist-sans/Geist-SemiBold.ttf'),
    font('geist-mono/GeistMono-Regular.ttf')
  ])

  return [
    { name: 'Geist', data: sans, weight: 400 as const },
    { name: 'Geist', data: sansSemiBold, weight: 600 as const },
    { name: 'Geist Mono', data: mono, weight: 400 as const }
  ]
}

// The editor-style frame every Open Graph image shares: logo on top, name and domain at the bottom.
export const ogFrame = (children: ReactNode) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: 72,
      background: OG_COLOR.bg,
      color: OG_COLOR.text,
      fontFamily: 'Geist'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Geist Mono', fontSize: 26 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          border: `2.5px solid ${OG_COLOR.text}`,
          borderRadius: 10,
          fontSize: 20
        }}
      >
        k/
      </div>
      kamycoding
    </div>

    {children}

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 28,
        borderTop: `1px solid ${OG_COLOR.hair}`,
        fontSize: 28
      }}
    >
      <span>Kamyar Zamanfar</span>
      <span style={{ fontFamily: 'Geist Mono', fontSize: 26, color: OG_COLOR.kw }}>kamycoding.com</span>
    </div>
  </div>
)
