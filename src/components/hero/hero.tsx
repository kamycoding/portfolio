import { getLocale, getTranslations } from 'next-intl/server'

import { postEntries } from '@/lib/blog/home'
import { listPosts } from '@/lib/blog/posts'
import { buildInfo } from '@/lib/version'

import HeroEditor from './hero-editor'
import HeroSurface from './hero-surface'
import TypedHeadline from './typed-headline'

import styles from './hero.module.css'

// index.tsx: the name and role on the left, the editor with terminal on the right. Typography carries the hero.
const Hero = async () => {
  const t = await getTranslations('hero')
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const posts = postEntries(await listPosts(), locale)

  return (
    <HeroSurface>
      <div className={styles.hero}>
        <div className={styles.intro}>
          <TypedHeadline name={t('headline.line1')} role={t('headline.line2')} />
        </div>

        <HeroEditor buildDate={buildInfo().date} posts={posts} />
      </div>
    </HeroSurface>
  )
}

export default Hero
