'use client'

import { useId, useState } from 'react'

import { useLocale, useTranslations } from 'next-intl'

import AudioButton from '@/components/blog/mdx/audio-button'
import PostLink from '@/components/blog/post-link'
import editor from '@/components/ui/editor.module.css'
import ui from '@/components/ui/ui.module.css'
import { Link } from '@/i18n/navigation'
import type { HomePost } from '@/lib/blog/home'
import { cn } from '@/lib/utils'

import styles from './journal.module.css'

type Heading = HomePost['headings'][number]

// A split editor like VS Code's Markdown preview: explorer tree on the left, preview of the selected post on the right.
// Server-rendered with the first post selected, so the page is complete before any script runs.
const JournalEditor = ({ posts }: Readonly<{ posts: readonly HomePost[] }>) => {
  const t = useTranslations('journal')
  const locale = useLocale()
  const id = useId()
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const post = posts[selected]
  const file = `${post.lang}.mdx`
  const shown = hovered ?? focused
  const heading = post.headings.find(item => item.id === shown)
  const { contrast, stats } = post

  const select = (index: number) => {
    setSelected(index)
    setHovered(null)
    setFocused(null)
  }

  // Hovering or focusing a heading shows it in the preview header; clicking opens the article there.
  const headingLink = (item: Heading, className: string) => (
    <PostLink
      slug={post.slug}
      language={post.lang}
      hash={item.id}
      className={className}
      onPointerEnter={() => setHovered(item.id)}
      onPointerLeave={() => setHovered(null)}
      onFocus={() => setFocused(item.id)}
      onBlur={() => setFocused(null)}
    >
      <span aria-hidden='true' className={styles.hash}>
        #
      </span>
      {item.text}
    </PostLink>
  )

  return (
    <div className={styles.window} data-shell-ui=''>
      <div className={styles.panes}>
        <nav aria-labelledby={`${id}-explorer`} className={styles.explorer}>
          <div className={styles.paneHead}>
            <span id={`${id}-explorer`} className={styles.explorerTitle}>
              {t('home.explorer')}
            </span>
          </div>
          <ul className={styles.tree}>
            <li>
              <span className={cn(styles.row, styles.root)}>
                <span aria-hidden='true' className={styles.chevron}>
                  ▾
                </span>
                blog/
              </span>
              <ul>
                {posts.map((item, index) => {
                  const open = index === selected

                  return (
                    <li key={item.slug}>
                      <button
                        type='button'
                        className={cn(styles.row, styles.folder)}
                        aria-expanded={open}
                        aria-controls={open ? `${id}-tree` : undefined}
                        data-selected={open || undefined}
                        onClick={() => select(index)}
                      >
                        <span aria-hidden='true' className={styles.chevron}>
                          {open ? '▾' : '▸'}
                        </span>
                        {item.slug}/
                      </button>
                      {open && (
                        <ul id={`${id}-tree`}>
                          <li>
                            <PostLink slug={item.slug} language={item.lang} className={cn(styles.row, styles.file)}>
                              <span aria-hidden='true' className={cn(editor.badge, styles.mdBadge)}>
                                M↓
                              </span>
                              {file}
                            </PostLink>
                            <ul aria-label={t('home.outline')}>
                              {item.headings.map(entry => (
                                <li key={entry.id}>{headingLink(entry, cn(styles.row, styles.heading))}</li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>

        <div className={styles.preview}>
          <div className={styles.paneHead}>
            <span className={styles.tab}>
              <span aria-hidden='true' className={cn(editor.badge, styles.mdBadge)}>
                M↓
              </span>
              {t('home.preview')}: {file}
            </span>
            <span aria-hidden='true' className={styles.crumb}>
              {heading && `§ ${heading.text}`}
            </span>
          </div>

          <article key={post.slug} className={styles.body}>
            <p className={styles.comment}>
              {'// '}
              {post.category} · {post.format} · <time dateTime={post.date}>{post.date}</time>
            </p>
            <h3 className={styles.title}>{post.title}</h3>
            <p lang={post.lang} className={styles.tldr}>
              {post.hasTldr && (
                <span lang={locale} className={styles.tldrLabel}>
                  {t('tldr')}
                </span>
              )}
              {post.summary}
            </p>

            {contrast && (
              <figure className={cn(editor.editor, styles.card)} aria-label={t('home.diffLabel')}>
                <div className={editor.edHead} aria-hidden='true'>
                  <div className={editor.edTab}>
                    <span className={cn(editor.badge, styles.diffBadge)}>±</span>textbook.diff
                  </div>
                  <span className={styles.stat}>
                    <span className={styles.minus}>-1</span> <span className={styles.plus}>+1</span>
                  </span>
                </div>
                <div className={styles.diff}>
                  <p className={styles.hunk} aria-hidden='true'>
                    @@ {t('home.textbook')} → {t('home.real')} @@
                  </p>
                  <div className={cn(styles.diffRow, styles.remove)}>
                    <span className={styles.label}>{t('home.textbook')}</span>
                    <del lang='de' className={styles.german}>
                      {contrast.textbook}
                    </del>
                  </div>
                  <div className={cn(styles.diffRow, styles.add)}>
                    <span className={styles.label}>{t('home.real')}</span>
                    <ins lang='de' className={styles.german}>
                      {contrast.real}
                    </ins>
                    <span className={styles.play}>
                      <AudioButton {...contrast.audio} label={t('audio.sentence')} />
                    </span>
                    <span lang='en' className={styles.meaning}>
                      {contrast.meaning}
                    </span>
                  </div>
                </div>
              </figure>
            )}

            <div className={styles.actions}>
              <PostLink slug={post.slug} language={post.lang} className={cn(ui.btn, ui.primary)}>
                <span lang={locale}>{t('home.read')}</span>
                <span aria-hidden='true'>→</span>
              </PostLink>
              <Link href='/blog' className={ui.btn}>
                {t('home.all')}
              </Link>
            </div>

            {/* The tree is hidden on small screens, so the outline moves under the preview as a short list. A post without a diff card shows it on wide screens too, so its preview is full. */}
            {post.headings.length > 0 && (
              <nav aria-label={t('home.outline')} className={cn(styles.outlineList, !contrast && styles.always)}>
                <p className={styles.outlineTitle} aria-hidden='true'>
                  {t('home.outline')}
                </p>
                <ul>
                  {post.headings.map(entry => (
                    <li key={entry.id}>{headingLink(entry, styles.outlineLink)}</li>
                  ))}
                </ul>
              </nav>
            )}
          </article>
        </div>
      </div>

      <ul className={styles.status} aria-label={t('home.status')}>
        {stats.minutes !== null && <li>{t('home.statusRead', { minutes: stats.minutes })}</li>}
        {stats.terms > 0 && <li>{t('home.statusTerms', { count: stats.terms })}</li>}
        {stats.clips > 0 && <li>{t('home.statusClips', { count: stats.clips })}</li>}
        <li>{t(`languages.${post.lang}`)}</li>
      </ul>
    </div>
  )
}

export default JournalEditor
