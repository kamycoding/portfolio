'use client'

// React Imports
import { useState } from 'react'

// Util Imports
import { cn } from '@/lib/utils'

const NOTES = [
  { text: 'Grab it for a surprise', position: 'top-[10%] left-[12%] rotate-[-8deg]' },
  { text: 'while (true) { try() }', position: 'top-[4%] left-[62%] rotate-[10deg]' },
  { text: 'Merge conflict :)', position: 'top-[3%] left-[3%] rotate-[-6deg]' },
  { text: 'git push --force? Never.', position: 'top-[54%] left-[68%] rotate-[12deg]' },
  { text: 'My cat caught it first', position: 'top-[45%] left-[36%] rotate-[4deg]' },
  { text: 'OK, you win. Say hi below', position: '-top-[2%] -left-[3%] rotate-[-10deg]' }
]

const SurpriseNote = () => {
  const [step, setStep] = useState(0)
  const note = NOTES[step]

  return (
    <div className='relative h-full'>
      {/* Decorative grab bar */}
      <div className='bg-background absolute top-8 right-[16%] left-[16%] h-2 rounded-full' />

      <div
        onMouseEnter={() => setStep(prev => (prev + 1) % NOTES.length)}
        className={cn('absolute z-20 w-32 cursor-pointer transition-all duration-500', note.position)}
      >
        <img src='/images/about-me/note.webp' alt='Note bg' className='w-full' />
        <p className='absolute inset-0 flex items-center justify-center px-4 text-center [font-family:var(--font-delicious-handrawn)] text-neutral-800'>
          {note.text}
        </p>
      </div>

      <p className='text-card-foreground absolute bottom-0 left-[10%] text-[26px] font-medium sm:text-nowrap md:left-1/2 md:-translate-x-1/2'>
        I have a surprise for you 🙃
      </p>
    </div>
  )
}

export default SurpriseNote
