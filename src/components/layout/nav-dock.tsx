'use client'

// Next Imports
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Component Imports
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/layout/mode-toggle'

// Hook Imports
import { useActiveSection } from '@/hooks/use-active-section'

// Util Imports
import { cn } from '@/lib/utils'

// SVG Imports
import UserIcon from '@/assets/svg/user'
import RulerPenIcon from '@/assets/svg/ruler-pen'
import ProgrammingIcon from '@/assets/svg/programming'
import TagPriceIcon from '@/assets/svg/tag-price'
import MailIcon from '@/assets/svg/mail'

const NAV_ITEMS = [
  { href: '/#about', id: 'about', label: 'About', icon: UserIcon },
  { href: '/#featured-works', id: 'featured-works', label: 'Work', icon: RulerPenIcon },
  { href: '/#experience', id: 'experience', label: 'Experience', icon: ProgrammingIcon },
  { href: '/#pricing', id: 'pricing', label: 'Pricing', icon: TagPriceIcon },
  { href: '/contact', id: 'contact', label: 'Contact', icon: MailIcon }
]

const SECTION_IDS = NAV_ITEMS.filter(item => item.id !== 'contact').map(item => item.id)

const NavDock = () => {
  const activeId = useActiveSection(SECTION_IDS)
  const pathname = usePathname()

  return (
    <nav className='group fixed bottom-4 left-1/2 z-70 -translate-x-1/2 lg:top-1/2 lg:bottom-auto lg:left-6 lg:translate-x-0 lg:-translate-y-1/2'>
      <div className='bg-card dark:bg-card flex w-fit flex-row items-stretch gap-1.5 rounded-lg border p-2 shadow-sm max-lg:p-1.5 lg:flex-col lg:rounded-[16px]'>
        {NAV_ITEMS.map(item => {
          const isActive = item.id === 'contact' ? pathname === item.href : pathname === '/' && item.id === activeId

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'hover:text-accent hover:bg-accent/10 dark:hover:text-accent flex h-8 items-center overflow-hidden rounded-sm px-2 transition-colors max-lg:h-7 lg:rounded-md',
                isActive ? 'text-accent bg-accent/10' : 'text-muted-foreground'
              )}
            >
              <item.icon className='size-4 shrink-0' />
              <span className='hidden overflow-hidden text-sm whitespace-nowrap transition-all duration-300 ease-out lg:inline-block lg:max-w-0 lg:opacity-0 lg:group-hover:ml-2 lg:group-hover:max-w-24 lg:group-hover:opacity-100'>
                {item.label}
              </span>
            </Link>
          )
        })}

        <Separator orientation='vertical' className='lg:hidden' />
        <Separator className='hidden lg:block' />

        <ModeToggle className='text-muted-foreground hover:text-accent hover:bg-accent/10 flex h-8 items-center overflow-hidden rounded-md px-2 transition-colors max-lg:h-7'>
          <span className='hidden overflow-hidden text-sm whitespace-nowrap transition-all duration-300 ease-out lg:inline-block lg:max-w-0 lg:opacity-0 lg:group-hover:ml-2 lg:group-hover:max-w-24 lg:group-hover:opacity-100'>
            Mode
          </span>
        </ModeToggle>
      </div>
    </nav>
  )
}

export default NavDock
