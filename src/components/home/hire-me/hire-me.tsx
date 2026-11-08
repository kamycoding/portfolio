// Component Imports
import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import ProfileCard from './profile-card'
import PricingCard from './pricing-card'

const HireMe = () => {
  return (
    <section id='work-with-me' className='border-b py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-245 space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='space-y-4'>
          <Eyebrow>Work with me</Eyebrow>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Looking for my next team
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[334px_1fr]'>
          <ProfileCard />
          <PricingCard />
        </div>
      </div>
    </section>
  )
}

export default HireMe
