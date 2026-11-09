import { ICON, INVERT_ON_DARK, TICKER } from '@/content/stack'
import { cn } from '@/lib/utils'

import styles from './hero.module.css'

// Decorative tech strip: the list is rendered twice so the -50% scroll loops seamlessly. Lazy icons keep React from
// adding 13 preload hints that compete with the fonts and leak into the legal pages through the home page prefetch.
const Ticker = () => {
  const items = [...TICKER, ...TICKER]

  return (
    <div aria-hidden='true' className={styles.ticker}>
      <div className={styles.track}>
        {items.map((name, index) => (
          <span key={`${name}-${index}`}>
            <img
              src={`/stack/${ICON[name]}.svg`}
              alt=''
              width={16}
              height={16}
              loading='lazy'
              className={cn(INVERT_ON_DARK.has(ICON[name]) && 'dark:invert')}
            />
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Ticker
