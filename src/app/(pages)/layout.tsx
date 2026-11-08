import type { ReactNode } from 'react'

import NavDock from '@/components/layout/nav-dock'
import Footer from '@/components/layout/footer'
import ScrollProfileToast from '@/components/layout/scroll-profile-toast'

const PagesLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className='flex h-full w-full min-w-0 flex-col'>
      <ScrollProfileToast />
      <NavDock />
      <main className='mx-auto flex w-full max-w-4xl min-w-0 flex-1 flex-col lg:border-x xl:max-w-245'>{children}</main>
      <Footer />
    </div>
  )
}

export default PagesLayout
