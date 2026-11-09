import type { ReactNode } from 'react'

import { getTranslations } from 'next-intl/server'

import Breadcrumb from '@/components/shell/breadcrumb'
import { type FileSectionId, getSection } from '@/lib/sections'
import { cn } from '@/lib/utils'

type SectionProps = Readonly<{
  id: FileSectionId
  children: ReactNode
}>

// A "file" section below the hero: top border, sticky breadcrumb, then the content (prototype .file and .sec).
const Section = async ({ id, children }: SectionProps) => {
  const t = await getTranslations('sections')
  const section = getSection(id)

  return (
    <section id={id} data-file={section.file} className='border-hair relative border-t'>
      {section.crumb && <Breadcrumb path={section.crumb} file={section.file} meta={t(`${id}.meta`)} />}
      <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>{children}</div>
    </section>
  )
}

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

// Section title style from the prototype (h2), shared by sub-headings like the git log and reviews.
export const HEADING_CLASS =
  'max-w-[18ch] text-[clamp(32px,3.6vw,54px)] leading-[1.06] font-semibold tracking-[-0.035em]'

type SectionHeadingProps = Readonly<{
  id: FileSectionId
  intro?: string
  className?: string
}>

// Eyebrow, two-tone title and optional intro, shared by every section.
export const SectionHeading = async ({ id, intro, className }: SectionHeadingProps) => {
  const t = await getTranslations('sections')

  return (
    <div className={className}>
      <p className='text-com mb-4.5 font-mono text-[13px]'>{t(`${id}.eyebrow`)}</p>
      <h2 className={HEADING_CLASS}>{t.rich(`${id}.title`, { soft })}</h2>
      {intro && <p className={cn('text-muted mt-4.5 max-w-[56ch] text-[16.5px] leading-[1.65]')}>{intro}</p>}
    </div>
  )
}

export default Section
