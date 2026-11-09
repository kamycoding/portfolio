import type { ReactNode } from 'react'

import { getLocale, getTranslations } from 'next-intl/server'

import Section, { HEADING_CLASS, SectionHeading } from '@/components/shell/section'
import ui from '@/components/ui/ui.module.css'
import { COMMITS } from '@/content/experience'
import { ICON, INVERT_ON_DARK } from '@/content/stack'
import { cn } from '@/lib/utils'

import CountUp from './count-up'
import Portrait from './portrait'
import Reviews from './reviews'

import styles from './about.module.css'

const REF_CLASS = { head: styles.refHead, br: styles.refBr, tag: styles.refTag } as const

// Markdown-style bold: the ** markers stay visible in a faint mono font, as in the prototype.
const markdownBold = (chunks: ReactNode) => (
  <strong>
    <span className={styles.mk}>**</span>
    {chunks}
    <span className={styles.mk}>**</span>
  </strong>
)

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

// about.md in the prototype: text with facts, ASCII portrait, experience as git log, reviews as PR reviews.
const About = async () => {
  const t = await getTranslations('about')
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'

  return (
    <Section id='about'>
      <SectionHeading id='about' />

      <div className={styles.about}>
        <div className={styles.md}>
          <div>
            <p>{t.rich('body.p1', { b: markdownBold })}</p>
            <p>{t.rich('body.p2', { b: markdownBold })}</p>
            <p>{t.rich('body.p3', { b: markdownBold })}</p>
          </div>
          <div className={styles.facts}>
            <div>
              <CountUp to={3} />
              <span>{t('facts.languages')}</span>
            </div>
            <div>
              <CountUp to={4} />
              <span>{t('facts.projects')}</span>
            </div>
            <div>
              <CountUp to={168} />
              <span>{t('facts.commits')}</span>
            </div>
          </div>
        </div>
        <Portrait />
      </div>

      <div className={styles.logHead}>
        <div>
          <p className='text-com mb-4.5 font-mono text-[13px]'>$ git log --graph --oneline</p>
          <h2 className={HEADING_CLASS}>{t.rich('log.title', { soft })}</h2>
        </div>
      </div>

      <div className={styles.gitlog}>
        {COMMITS.map(commit => {
          const copy = commit[locale]

          return (
            <article key={commit.hash} className={styles.commit}>
              <div className={styles.when}>{copy.when}</div>
              <div className={styles.rail}>
                <span className={cn(styles.node, commit.head && styles.headNode)} />
              </div>
              <div className={styles.card}>
                <div className={styles.meta}>
                  <span className={styles.hash}>{commit.hash}</span>
                  {commit.refs.map(([kind, label]) => (
                    <span key={label} className={cn(styles.ref, REF_CLASS[kind])}>
                      {label}
                    </span>
                  ))}
                  <span className={styles.whenMobile}>{copy.when}</span>
                </div>
                <h3>
                  <span className={styles.scope}>{copy.scope}</span>
                  {copy.title}
                </h3>
                <div className={styles.role}>{copy.role}</div>
                <p>{copy.text}</p>
                {copy.diff.length > 0 && (
                  <div className={styles.diff}>
                    {copy.diff.map((line, index) => (
                      <span key={line}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </div>
                )}
                {commit.stack.length > 0 && (
                  <div className={styles.stackRow}>
                    {commit.stack.map(name => (
                      <span key={name} className={ui.pill}>
                        {ICON[name] && (
                          <img
                            src={`/stack/${ICON[name]}.svg`}
                            loading='lazy'
                            alt=''
                            width={14}
                            height={14}
                            className={cn(INVERT_ON_DARK.has(ICON[name]) && 'dark:invert')}
                          />
                        )}
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <Reviews />
    </Section>
  )
}

export default About
