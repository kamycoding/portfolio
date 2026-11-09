import type { ReactNode } from 'react'

import { getTranslations } from 'next-intl/server'

import Breadcrumb from '@/components/shell/breadcrumb'
import { HEADING_CLASS } from '@/components/shell/section'
import { Link } from '@/i18n/navigation'
import type { Page } from '@/lib/sections'
import { cn } from '@/lib/utils'

import styles from './legal.module.css'

type LegalPageProps = Readonly<{
  page: Page
  meta: string
  title: string
  updated: Readonly<{ label: string; date: string; dateTime: string }>
  children: ReactNode
}>

// Frame for the legal texts: breadcrumb, back link, title, then the text as a Markdown file.
const LegalPage = async ({ page, meta, title, updated, children }: LegalPageProps) => {
  const t = await getTranslations('legal')

  return (
    <article aria-labelledby='legal-title'>
      <Breadcrumb path={page.crumb} file={page.file} meta={meta} />
      <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
        <Link href='/' className={styles.back}>
          <span aria-hidden='true'>←</span>
          {t('back')}
        </Link>
        <p className='text-com mb-4.5 font-mono text-[13px]'>{t('eyebrow')}</p>
        <h1 id='legal-title' className={cn(HEADING_CLASS, 'max-w-none hyphens-auto')}>
          {title}
        </h1>
        <div className={styles.md}>{children}</div>
        <p className={styles.updated}>
          {updated.label}: <time dateTime={updated.dateTime}>{updated.date}</time>
        </p>
      </div>
    </article>
  )
}

// v1 keeps paragraphs and list items as arrays in the messages.
export const Paragraphs = ({ items }: Readonly<{ items: readonly string[] }>) =>
  items.map(text => <p key={text}>{text}</p>)

export const List = ({ items }: Readonly<{ items: readonly string[] }>) => (
  <ul>
    {items.map(text => (
      <li key={text}>{text}</li>
    ))}
  </ul>
)

export default LegalPage
