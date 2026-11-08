'use client'

// Third-party Imports
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

import GithubIcon from '@/assets/svg/github-icon'
import InstagramIcon from '@/assets/svg/instagram-icon'
import LinkedinIcon from '@/assets/svg/linkedin-icon'

// Component Imports
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const SOCIALS = [
  { label: 'Github', icon: GithubIcon },
  { label: 'LinkedIn', icon: LinkedinIcon },
  { label: 'Instagram', icon: InstagramIcon }
]

const ProfilePanel = () => {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 })

  const translateX = useTransform(springX, [0, 1], [20, -20])
  const translateY = useTransform(springY, [0, 1], [20, -20])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()

    mouseX.set((event.clientX - bounds.left) / bounds.width)
    mouseY.set((event.clientY - bounds.top) / bounds.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <div className='flex h-full flex-col justify-end overflow-hidden'>
      <div className='relative h-full w-full overflow-hidden rounded-3xl'>
        <img src='/images/services/service-bg.webp' alt='Zolt Mercer' className='h-full object-cover' />

        <motion.div
          className='absolute bottom-0 max-lg:left-1/2 max-lg:-translate-x-1/2'
          style={{ x: translateX, y: translateY }}
          whileHover={{ scale: 1.1 }}
          transition={{ scale: { duration: 0.4, ease: 'easeOut' } }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img src='/images/services/services-profile.webp' alt='Zolt Mercer' className='max-w-120 object-cover' />
        </motion.div>

        <div className='absolute inset-x-0 bottom-0 flex justify-center'>
          <Badge
            variant='outline'
            className='bg-card h-7.5 gap-1.5 rounded-[12px] rounded-b-none border-0 px-3 py-1 text-sm text-green-600 uppercase shadow-sm dark:text-green-400'
          >
            <span className='relative inline-flex size-1.5'>
              <span className='absolute -inset-0.5 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-600/40 opacity-75 dark:bg-green-400/40' />
              <span className='relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-400' />
            </span>
            Available
          </Badge>
        </div>
      </div>

      <div className='flex flex-col items-center justify-between gap-1.5 px-5 py-4'>
        <p className='flex items-center gap-2 font-medium'>
          Zolt Mercer
          <span className='bg-muted-foreground inline-block size-2 rounded-full' />
          <span className='text-muted-foreground font-normal'>Design engineer</span>
        </p>

        <div className='flex items-center gap-1'>
          {SOCIALS.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant='ghost'
              size='icon-sm'
              aria-label={label}
              className='text-muted-foreground/80 hover:bg-transparent dark:hover:bg-transparent'
              render={<a href='#' />}
              nativeButton={false}
            >
              <Icon className='size-4.5' />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePanel
