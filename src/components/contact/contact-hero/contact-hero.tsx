'use client'

import GithubIcon from '@/assets/svg/github-icon'
import LinkedinIcon from '@/assets/svg/linkedin-icon'

// Component Imports
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import ContactForm from '@/components/contact/contact-form/contact-form'

const SOCIALS = [
  { label: 'GitHub', icon: GithubIcon, href: 'https://github.com/kamycoding' },
  { label: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com/in/kamyarzamanfar' }
]

const ContactHero = () => {
  return (
    <section className='border-b py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-245 space-y-10 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='max-w-2xl space-y-2'>
          <Eyebrow>Contact me</Eyebrow>
          <h1 className='text-2xl font-semibold sm:text-3xl lg:text-[36px]'>
            <span className='max-md:hidden'>Feel free to send me a message,</span>{' '}
            <span className='text-nowrap max-md:hidden'>I will get back to you as soon as possible.</span>
            <span className='md:hidden'>
              Feel free to send me a message, I will get back to you as soon as possible.
            </span>
          </h1>
        </div>

        <div className='grid gap-8 lg:grid-cols-2'>
          <ContactForm className='order-2 lg:order-1' />

          <div className='order-1 mx-auto flex h-full max-h-130 w-full flex-col lg:order-2'>
            <div className='relative w-full overflow-hidden rounded-3xl'>
              <img src='/images/k/portrait-2.webp' alt='Kamyar Zamanfar' className='h-93.5 w-full object-cover object-[50%_20%]' />


              <div className='absolute inset-x-0 bottom-0 flex justify-center'>
                <Badge
                  variant='outline'
                  className='bg-card h-7.5 gap-1.5 rounded-[12px] rounded-b-none border-0 px-3 py-1 text-sm text-green-600 uppercase shadow-sm dark:text-green-400'
                >
                  <span className='relative inline-flex size-1.5'>
                    <span className='absolute -inset-0.5 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-600/40 opacity-75 dark:bg-green-400/40' />
                    <span className='relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-400' />
                  </span>
                  Open to work
                </Badge>
              </div>
            </div>

            <div className='flex flex-col items-center justify-between gap-1.5 px-5 py-4'>
              <p className='flex items-center gap-2 font-medium'>
                Kamyar Zamanfar
                <span className='bg-muted-foreground inline-block size-2 rounded-full' />
                <span className='text-muted-foreground font-normal'>Full-stack developer</span>
              </p>

              <div className='flex items-center gap-1'>
                {SOCIALS.map(({ label, icon: Icon, href }) => (
                  <Button
                    key={label}
                    variant='ghost'
                    size='icon-sm'
                    aria-label={label}
                    className='text-muted-foreground/80 hover:bg-transparent dark:hover:bg-transparent'
                    render={<a href={href} target='_blank' rel='noopener noreferrer' />}
                    nativeButton={false}
                  >
                    <Icon className='size-4' />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHero
