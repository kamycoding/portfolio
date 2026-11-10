import { getLocale, getTranslations } from 'next-intl/server'

import { shorten, type EditorCard as EditorCardData } from '@/lib/blog/home'
import { tokenizeLine } from '@/lib/blog/tokenize'
import { cn } from '@/lib/utils'

import CardActions from './card-actions'
import styles from './journal.module.css'

// The lines of the code-style preview: the title, the TL;DR as a comment, then up to two hook lines.
const LINES = 4

const Code = ({ text }: Readonly<{ text: string }>) =>
  tokenizeLine(text).map((token, index) => (
    <span key={index} className={styles[token.kind]}>
      {token.text}
    </span>
  ))

// A small editor window for one post. Static HTML: only the actions row needs script.
const EditorCard = async ({ card, titleId }: Readonly<{ card: EditorCardData; titleId: string }>) => {
  const t = await getTranslations('journal')
  const locale = await getLocale()

  const languages = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(
    card.languages.map(lang => t(`languages.${lang}`))
  )

  const hooks = card.preview.slice(0, LINES - 2)

  return (
    <div className={styles.window}>
      <div className={styles.tab}>
        <span className={styles.file} title={`${card.slug}.mdx`}>
          <span aria-hidden='true' className={styles.mdBadge}>
            M↓
          </span>
          <span className={styles.fileName}>{card.fileName}.mdx</span>
        </span>
        <span aria-hidden='true' className={styles.langs}>
          {card.languages.map(lang => (
            <span key={lang} className={styles.lang}>
              {lang.toUpperCase()}
            </span>
          ))}
        </span>
        <span className='sr-only'>{t('home.availableIn', { languages })}</span>
      </div>

      <div className={styles.code} lang={card.lang}>
        <div className={styles.lines}>
          <div className={styles.line}>
            <span aria-hidden='true' className={styles.ln}>
              1
            </span>
            <h3 id={titleId} className={styles.title}>
              <span aria-hidden='true' className={styles.hash}>
                #{' '}
              </span>
              {card.title}
            </h3>
          </div>
          <div className={styles.line}>
            <span aria-hidden='true' className={styles.ln}>
              2
            </span>
            <p className={cn(styles.src, styles.com)}>{`// ${shorten(card.summary)}`}</p>
          </div>
          {Array.from({ length: LINES - 2 }, (_, index) => {
            const hook = hooks[index]

            return (
              <div key={index} className={styles.line} data-kind={hook?.kind}>
                <span aria-hidden='true' className={styles.ln}>
                  {index + 3}
                </span>
                {hook && (
                  <p className={styles.src}>
                    {hook.kind === 'add' && <span className='sr-only'>{t('home.lineAdded')}</span>}
                    {hook.kind === 'remove' && <span className='sr-only'>{t('home.lineRemoved')}</span>}
                    {hook.kind === 'comment' ? (
                      <span className={styles.com}>{`// ${hook.text}`}</span>
                    ) : (
                      <Code text={hook.text} />
                    )}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* One bar per h2 section, as long as the section's text. */}
        {card.minimap && (
          <div aria-hidden='true' className={styles.minimap}>
            {card.minimap.slice(0, 12).map((weight, index) => (
              <span key={index} style={{ width: `${Math.round(weight * 100)}%` }} />
            ))}
          </div>
        )}
      </div>

      <p className={styles.foot}>
        <span>{card.category}</span>
        {card.minutes !== null && <span>{t('home.minutes', { minutes: card.minutes })}</span>}
        {card.badges.audio && <span className={styles.badge}>{t('home.badgeAudio')}</span>}
        {card.badges.interactive && <span className={styles.badge}>{t('home.badgeInteractive')}</span>}
        {card.badges.quiz && <span className={styles.badge}>{t('home.badgeQuiz')}</span>}
      </p>

      <CardActions slug={card.slug} lang={card.lang} other={card.other} url={card.url} listen={card.listen} />
    </div>
  )
}

export default EditorCard
