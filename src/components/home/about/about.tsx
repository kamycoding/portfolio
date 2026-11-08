// Component Imports
import { Card, CardContent } from '@/components/ui/card'
import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import ProfileCarousel from './profile-carousel'
import MusicPlayerCard from './music-player-card'
import TripFolderCard from './trip-folder-card'
import SurpriseNote from './surprise-note'

const About = () => {
  return (
    <section id='about' className='border-b py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='space-y-2'>
          <Eyebrow>About me</Eyebrow>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Architect by training, developer by choice</h2>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-[380px_1fr]'>
          <ProfileCarousel />

          <div className='grid gap-4 md:h-130 lg:grid-cols-2 lg:grid-rows-2'>
            <MusicPlayerCard />

            <TripFolderCard />

            <Card className='ring-border overflow-visible rounded-[24px] bg-(--background-darker) shadow-none max-lg:hidden max-md:h-70 max-md:min-h-50 sm:col-span-2'>
              <CardContent className='h-full max-md:px-4'>
                <SurpriseNote />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
