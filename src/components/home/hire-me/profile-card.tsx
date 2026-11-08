'use client'

// React Imports
import { useRef, useState } from 'react'

// Third-party Imports
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { MapPinIcon } from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Years in web', value: '3' },
  { label: 'Projects', value: '4' },
  { label: 'Languages', value: '3' }
]

const ProfileCard = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.5 })
  const rotate = useTransform(progress, [0, 0.5, 1], [-4, 0, 4])

  return (
    <div
      ref={containerRef}
      className={cn('bg-background flex flex-col justify-between rounded-2xl border p-6', className)}
    >
      <motion.div
        style={{ rotate }}
        className='-ml-4 origin-bottom perspective-[1500px] sm:w-88 md:-ml-9 md:w-68 lg:-ml-9 lg:w-88'
      >
        <div
          role='button'
          tabIndex={0}
          aria-pressed={isFlipped}
          onClick={() => setIsFlipped(prev => !prev)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setIsFlipped(prev => !prev)
            }
          }}
          className={cn(
            'relative cursor-pointer transition-transform duration-700 transform-3d',
            isFlipped && 'transform-[rotateY(180deg)]'
          )}
        >
          <Card className='shadow-lg ring-0 backface-hidden dark:ring dark:ring-white/20'>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='flex grow flex-col items-center gap-4'>
                  <div className='relative'>
                    <Avatar className='size-30'>
                      <AvatarImage src='/images/k/portrait-2.webp' alt='Kamyar Zamanfar' className='object-cover object-top' />
                      <AvatarFallback>K</AvatarFallback>
                    </Avatar>
                    <span className='absolute -bottom-3 left-[50%] flex size-7.5 -translate-x-1/2 items-center justify-center'>
                      <img src='/images/hire-me/profile-star-icon.webp' alt='Verified' />
                    </span>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold lg:text-[36px]'>Kamyar Zamanfar</h3>
                    <p className='text-muted-foreground flex items-center justify-center gap-1 text-base font-medium'>
                      <MapPinIcon className='fill-muted-foreground text-card size-5' />
                      Cologne, Germany
                    </p>
                  </div>
                </div>

                <div className='divide-border divide-y text-center'>
                  {STATS.map(stat => (
                    <div key={stat.label} className='py-1.5 first:pt-0 last:pb-0'>
                      <p className='text-foreground text-xl font-semibold lg:text-[26px]'>{stat.value}</p>
                      <p className='text-base'>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{ backgroundImage: "url('/images/hire-me/card-back-bg.webp')" }}
            className='absolute inset-0 transform-[rotateY(180deg)] overflow-hidden rounded-[24px] bg-black bg-cover bg-center text-white shadow-lg ring-0 backface-hidden dark:ring dark:ring-white/20'
          >
            <CardContent className='relative flex h-full flex-col justify-between gap-6'>
              <div>
                <p className='text-xs text-white/60'>Kamyar Zamanfar</p>
                <h3 className='text-base font-medium'>Persian, German, English</h3>
              </div>

              <div className='flex items-end justify-between gap-3'>
                <p className='text-base'>
                  I care about structure, details and building things people actually enjoy using.
                </p>
                <Avatar className='h-24.5 w-20.5 shrink-0 rounded-[12px]'>
                  <AvatarImage src='/images/k/portrait-2.webp' alt='Kamyar Zamanfar' className='rounded-[12px] object-cover object-top' />
                  <AvatarFallback>K</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className='mt-6 space-y-3'>
        <Badge
          variant='outline'
          className='bg-card h-6.5 gap-1 rounded-full text-green-600 shadow-sm dark:text-green-400'
        >
          <span className='relative inline-flex size-1.5'>
            <span className='absolute -inset-0.5 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-600/40 opacity-75 dark:bg-green-400/40' />
            <span className='relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-400' />
          </span>
          Open to work
        </Badge>

        <p className='mb-2 text-xl font-medium sm:text-2xl lg:text-[30px]'>Let&apos;s work together</p>

        <p className='text-muted-foreground text-base'>
          Based in Cologne. Open to full-time roles, freelance projects, remote work and relocation.
        </p>
      </div>
    </div>
  )
}

export default ProfileCard
