// Component Imports
import ProfilePanel from './profile-panel'
import ServiceStepCard from './service-step-card'

const SelectService = () => {
  return (
    <section id='select-service' className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto grid max-w-245 gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:px-10.5'>
        <ProfilePanel />
        <ServiceStepCard />
      </div>
    </section>
  )
}

export default SelectService
