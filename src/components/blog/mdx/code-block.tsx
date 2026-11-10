'use client'

import { type ComponentProps, useEffect, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { copyText, readCodeLines, resultingCode } from '@/lib/blog/code'
import { cn } from '@/lib/utils'

import styles from './code-block.module.css'

type CodeBlockProps = ComponentProps<'pre'> & Readonly<{ 'data-filename'?: string; 'data-language'?: string }>

type CopyState = 'idle' | 'copied' | 'failed'

// MDX maps every fenced block's <pre> here; rehype.mjs already highlighted it and set the data attributes.
const CodeBlock = ({
  children,
  className,
  style,
  tabIndex,
  'data-filename': filename,
  'data-language': language
}: CodeBlockProps) => {
  const t = useTranslations('journal')
  const pre = useRef<HTMLPreElement>(null)
  const [state, setState] = useState<CopyState>('idle')
  const label = filename ?? language

  useEffect(() => {
    if (state !== 'copied') return

    const timeout = window.setTimeout(() => setState('idle'), 2000)

    return () => window.clearTimeout(timeout)
  }, [state])

  const copy = async () => {
    try {
      await copyText(resultingCode(readCodeLines(pre.current!)), navigator.clipboard)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <div className={styles.frame}>
      <div className={styles.header}>
        {label && <span className={styles.label}>{label}</span>}

        {/* Rendered empty from the start, so screen readers register the live region before the first click. */}
        <span role='status' className={cn(styles.status, state === 'failed' && styles.failed)}>
          {state === 'copied' ? t('copied') : state === 'failed' ? t('copyFailed') : ''}
        </span>
        <button type='button' className={styles.copy} onClick={copy}>
          {t('copy')}
          {label && <span className='sr-only'>, {label}</span>}
        </button>
      </div>
      <pre ref={pre} className={cn(className, styles.pre)} style={style} tabIndex={tabIndex}>
        {children}
      </pre>
    </div>
  )
}

export default CodeBlock
