import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Third-party Imports
import { ChevronLeftIcon } from 'lucide-react'

import UsersGroupIcon from '@/assets/svg/users-group-icon'
import CalendarIcon from '@/assets/svg/calendar-icon'
import UserCircleIcon from '@/assets/svg/user-circle-icon'
import RulerPenIcon from '@/assets/svg/ruler-pen-icon'

// Component Imports
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MDXContent from '@/components/mdx-content'
import FeaturedWorks from '@/components/shared/featured-works/featured-works'
import ReadingProgressPill from '@/components/case-study/reading-progress-pill'

// Data Imports
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/case-studies'
import { extractHeadings } from '@/lib/extract-headings'

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()

  return caseStudies.map(caseStudy => ({ slug: caseStudy.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    return {}
  }

  const { metadata } = caseStudy

  return {
    title: `Case Study: ${metadata.title}`,
    description: metadata.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/case-study/${metadata.slug}`
    }
  }
}

export const dynamicParams = false

const CaseStudyDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const caseStudies = await getCaseStudies()

  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  const { metadata, content } = caseStudy

  const otherCaseStudies = caseStudies.filter(item => item.slug !== slug).slice(0, 2)
  const headings = extractHeadings(content)

  const heroImageSrc = metadata.heroImage ?? metadata.image

  const metaItems = [
    { label: 'Organisation', value: metadata.organisation, icon: UsersGroupIcon },
    { label: 'Role', value: metadata.role, icon: UserCircleIcon },
    { label: 'Duration', value: metadata.duration, icon: CalendarIcon }
  ].filter(item => item.value)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}#webpage`,
        name: `Case Study: ${metadata.title}`,
        description: metadata.description,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/case-study/${metadata.slug}`
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${process.env.NEXT_PUBLIC_APP_URL}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: metadata.title,
            item: `${process.env.NEXT_PUBLIC_APP_URL}/case-study/${metadata.slug}`
          }
        ]
      }
    ]
  }

  return (
    <>
      <ReadingProgressPill headings={headings} contentId='case-study-content' />

      <section className='mx-auto space-y-8 border-b px-4 pb-8 text-center max-sm:pt-20 sm:px-6 sm:py-24 lg:px-10.5'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground mr-auto flex items-center gap-2 text-base'
        >
          <Button
            variant='ghost'
            size='icon-xs'
            className='text-foreground size-6 bg-(--background-darker) hover:bg-(--background-darker)'
          >
            <ChevronLeftIcon className='size-4' />
          </Button>
          Back to home
        </Link>

        <h1 className='text-card-foreground text-3xl leading-[1.2] font-semibold sm:text-4xl md:text-5xl lg:text-[64px]'>
          {metadata.title}
        </h1>

        {heroImageSrc && (
          <div className='bg-card relative w-full overflow-hidden rounded-3xl p-2 sm:p-3 dark:bg-white/10'>
            <div className='bg-background relative size-full overflow-hidden rounded-2xl'>
              <img src={heroImageSrc} alt={metadata.title ?? ''} className='object-cover' />
            </div>
          </div>
        )}

        {metaItems.length > 0 && (
          <div className='mx-auto grid max-w-xl justify-start gap-4 pt-16 text-left sm:grid-cols-2 sm:justify-center'>
            {metaItems.map(item => (
              <div key={item.label} className='flex w-fit items-center gap-3'>
                <div className='flex size-13.5 shrink-0 items-center justify-center rounded-xl bg-(--background-darker)'>
                  <item.icon className='text-accent size-8' />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs tracking-wide uppercase'>{item.label}</p>
                  <p className='font-medium'>{item.value}</p>
                </div>
              </div>
            ))}

            {metadata.tools && metadata.tools.length > 0 && (
              <div className='flex items-center gap-3 max-sm:justify-start'>
                <div className='flex size-13.5 shrink-0 items-center justify-center rounded-xl bg-(--background-darker)'>
                  <RulerPenIcon className='text-accent size-8' />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs tracking-wide uppercase'>Tools & Technologies</p>
                  <div className='mt-1 flex flex-wrap gap-1.5'>
                    {metadata.tools.map(tool => (
                      <Badge
                        key={tool}
                        variant='secondary'
                        className='text-foreground bg-(--background-darker) font-normal'
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div id='case-study-content' className='mt-16 text-left'>
          <MDXContent source={content} />
        </div>
      </section>

      <FeaturedWorks
        caseStudies={otherCaseStudies}
        id='other-works'
        eyebrow='Other works'
        layout='vertical'
        title='Have a look at my other work'
        showBorder={false}
      />

      {/* Add JSON-LD to your page */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />
    </>
  )
}

export default CaseStudyDetailsPage
