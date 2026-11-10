import type { ReactNode } from 'react'

import type { StaticImageData } from 'next/image'

import styles from './blocks.module.css'

type FigureProps = Readonly<{ src: StaticImageData; alt: string; children?: ReactNode }>

/*
 * A plain <img> from a static import in the MDX: the intrinsic size reserves the space, and the hashed asset is
 * served from the own origin without an image function (docs/adr/0007).
 */
const Figure = ({ src, alt, children }: FigureProps) => {
  // MDX is not type-checked, so a missing import or alt text fails the build here instead of shipping.
  if (typeof src !== 'object' || !src.width) throw new Error('<Figure> needs a statically imported image as src.')
  if (typeof alt !== 'string') throw new Error(`<Figure> needs alt text for ${src.src} (alt="" if decorative).`)

  return (
    <figure className={styles.figure}>
      <img src={src.src} width={src.width} height={src.height} alt={alt} loading='lazy' decoding='async' />
      {children && <figcaption className={styles.caption}>{children}</figcaption>}
    </figure>
  )
}

export default Figure
