// Component Imports
import Eyebrow from '@/components/shared/eyebrow/eyebrow'
import Timeline from '@/components/ui/timeline'
import ActivityCard from './activity-card'
import ExperienceTimelineItem from './experience-timeline-item'

const EXPERIENCES = [
  {
    index: '01',
    logo: '/images/k/logo-heldio.webp',
    company: 'Heldio',
    role: 'Co-founder & Frontend Developer',
    period: '2026 -',
    status: { text: 'Present', tone: 'positive' as const },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NestJS', 'PostgreSQL'],
    achievement: 'Shaped the MVP from first concept to a working learning loop',
    description:
      'An AI-powered platform for contextual language learning. I lead the product concept, MVP scope and roadmap, and build the frontend of the responsive web platform.'
  },
  {
    index: '02',
    logo: '/images/k/logo-da.webp',
    company: 'Developer Akademie',
    role: 'Full-stack & AI Software Developer training',
    period: 'Ongoing',
    status: { text: 'Front-end certificate, Sep 2026', tone: 'accent' as const },
    stack: ['Angular', 'TypeScript', 'Supabase', 'Python', 'Django'],
    achievement: 'Shipped Join, a team-built Kanban app, and this portfolio',
    description:
      'Intensive training with team projects, code reviews and real deadlines. Front-end part completed, now working through backend and AI modules.'
  },
  {
    index: '03',
    logo: '/images/k/logo-osify.webp',
    company: 'OsifyAI',
    role: 'Freelance Frontend Developer',
    period: 'Jun 2025 - Nov 2025',
    stack: ['React', 'TypeScript', 'Design system'],
    achievement: 'Built reusable React components for patient and doctor dashboards',
    description:
      'AI software for medical practices. I worked on the design system and the React components behind the patient and doctor dashboards.'
  },
  {
    index: '04',
    logo: '/images/k/logo-tarahimo.webp',
    company: 'Tarahimo',
    role: 'Co-founder',
    period: 'Oct 2022 - Aug 2024',
    stack: ['Website', 'Order forms', 'B2C and B2B'],
    achievement: 'Ran the website and the order flows of a branding startup',
    description:
      'A branding startup in Iran. I looked after the website and the order forms for private and business customers. Before that: a degree in architecture, where 3D tools first got me into software.'
  }
]

const Experience = () => {
  return (
    <section id='experience' className='min-w-0 border-b py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-10.5'>
        <div className='space-y-2'>
          <Eyebrow>Stacks & Experience</Eyebrow>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            What I work with and where I learned it
          </h2>
        </div>

        <ActivityCard />

        <Timeline
          data={EXPERIENCES.map(({ index, ...experience }) => ({
            index,
            content: <ExperienceTimelineItem {...experience} />
          }))}
        />
      </div>
    </section>
  )
}

export default Experience
