import { getTranslations } from 'next-intl/server'

import HeroEditor from './hero-editor'
import HeroSurface from './hero-surface'
import TypedHeadline from './typed-headline'

import styles from './hero.module.css'

// index.tsx: the name and role on the left, the editor with terminal on the right. Typography carries the hero.
const Hero = async () => {
  const t = await getTranslations('hero')

  return (
    <HeroSurface>
      <div className={styles.hero}>
        <div className={styles.intro}>
          <TypedHeadline name={t('headline.line1')} role={t('headline.line2')} />
        </div>

        <HeroEditor />
      </div>
    </HeroSurface>
  )
}

export default Hero
