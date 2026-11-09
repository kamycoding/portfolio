'use client'

import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { wakeCat } from '@/hooks/use-cat'
import { useReady } from '@/hooks/use-ready'
import { PROJECTS } from '@/content/projects'
import { STACK } from '@/content/stack'
import { usePathname, useRouter } from '@/i18n/navigation'
import { copyEmail, EMAIL, goToSection, prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import styles from './hero.module.css'

type Line = Readonly<{ id: number; kind: 'cmd' | 'out'; content: ReactNode }>

// Command list for Tab completion, as in the prototype.
const COMMANDS = [
  'help',
  'whoami',
  'ls',
  'open',
  'projects',
  'stack',
  'contact',
  'cat',
  'theme',
  'lang',
  'date',
  'clear',
  'sudo'
]

const SECTIONS: Readonly<Record<string, string>> = {
  work: 'work',
  'work.tsx': 'work',
  about: 'about',
  'about.md': 'about',
  stack: 'stack',
  'stack.json': 'stack',
  contact: 'contact',
  'contact.ts': 'contact'
}

const PROMPT = '~/kamycoding $'

// Output survives a language switch (which remounts the page), like the prototype's single page.
let savedLines: Line[] = []
let nextId = 1
let introDone = false
const history: string[] = []
let historyIndex = 0
const listeners = new Set<() => void>()

const setLines = (next: Line[]) => {
  savedLines = next
  listeners.forEach(listener => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

const bold = (chunks: ReactNode) => <b>{chunks}</b>

const Terminal = () => {
  const t = useTranslations('hero.terminal')
  const tHero = useTranslations('hero')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const ready = useReady()

  const lines = useSyncExternalStore(
    subscribe,
    () => savedLines,
    () => savedLines
  )

  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const print = (content: ReactNode, kind: Line['kind'] = 'out') =>
    setLines([...savedLines, { id: nextId++, kind, content }])

  const run = (raw: string) => {
    const line = raw.trim()

    print(
      <>
        <span className={styles.prompt}>{PROMPT}</span> {line}
      </>,
      'cmd'
    )

    if (!line) return

    history.push(line)
    historyIndex = history.length

    const [command, ...args] = line.split(/\s+/)
    const arg = args.join(' ').toLowerCase()

    switch (command.toLowerCase()) {
      case 'help':
        return print(t.rich('help', { b: bold }))
      case 'whoami':
        return print(t.rich('whoami', { b: bold }))
      case 'ls':
        return print(
          <>
            <b>work.tsx</b>
            {'  '}
            <b>about.md</b>
            {'  '}
            <b>stack.json</b>
            {'  '}
            <b>contact.ts</b>
            {'  '}README.md
          </>
        )
      case 'open':

      case 'cd': {
        const target = SECTIONS[arg]

        if (!target) return print(t('openUsage'))

        print(
          <>
            <span className={styles.ok}>→</span> {target}
          </>
        )
        window.setTimeout(() => goToSection(target), 250)

        return
      }

      case 'projects':
        return print(
          PROJECTS.map((project, index) => (
            <span key={project.id}>
              {index > 0 && '\n'}
              <b>{project.id}/</b>
              {'  '}
              {project[locale === 'de' ? 'de' : 'en'].tag}
            </span>
          ))
        )
      case 'stack':
        return print(
          Object.entries(STACK).map(([group, items], index) => (
            <span key={group}>
              {index > 0 && '\n'}
              <b>{group}</b>: {items.join(', ')}
            </span>
          ))
        )
      case 'contact':
      case 'email':
        void copyEmail(tCommon('copied'))

        return print(
          <>
            {EMAIL} <span className={styles.ok}>{t('copied')}</span>
          </>
        )
      case 'cat':
      case 'meow':
        wakeCat()

        return print(t('cat'))

      case 'theme': {
        const next = resolvedTheme === 'light' ? 'dark' : 'light'

        setTheme(next)

        return print(`theme: ${next}`)
      }

      case 'lang': {
        const next = locale === 'en' ? 'de' : 'en'

        print(`lang: ${next}`)
        router.replace(`${pathname}${window.location.hash}`, { locale: next })

        return
      }

      case 'date':
        return print(
          `${new Date().toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
            timeZone: 'Europe/Berlin',
            dateStyle: 'full',
            timeStyle: 'short'
          })}, ${tHero('now.city')}`
        )
      case 'clear':
        return setLines([])
      case 'sudo':
        if (!arg.startsWith('hire')) return print(t('sudoNo'))

        print(<span className={styles.ok}>{t('sudo')}</span>)
        window.setTimeout(() => goToSection('contact'), 700)

        return
      default:
        print(
          <>
            <span className={styles.err}>zsh: command not found: {command}</span>
            {'  '}
            {t('tryHelp')}
          </>
        )
    }
  }

  // The prototype types "whoami" once, after the intro.
  useEffect(() => {
    if (!ready || introDone || savedLines.length > 0) return

    introDone = true

    const finish = () => {
      setInput('')
      run('whoami')
      print(<span className={styles.dim}>{t('hint')}</span>)
    }

    if (prefersReducedMotion()) {
      const timer = window.setTimeout(finish, 0)

      return () => window.clearTimeout(timer)
    }

    const command = 'whoami'
    const timers: number[] = []

    for (let index = 1; index <= command.length; index++) {
      timers.push(window.setTimeout(() => setInput(command.slice(0, index)), 900 + index * 70))
    }

    timers.push(window.setTimeout(finish, 900 + command.length * 70 + 260))

    return () => timers.forEach(timer => window.clearTimeout(timer))

    // run and print only read the current store, so the intro does not need them as dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // Keep the newest output in view.
  useEffect(() => {
    const body = bodyRef.current

    if (body) body.scrollTop = body.scrollHeight
  }, [lines])

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      run(input)
      setInput('')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()

      if (historyIndex > 0) setInput(history[--historyIndex] ?? '')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      historyIndex = Math.min(history.length, historyIndex + 1)
      setInput(history[historyIndex] ?? '')
    } else if (event.key === 'Tab') {
      const matches = COMMANDS.filter(command => command.startsWith(input.trim().toLowerCase()))

      // An empty prompt keeps normal Tab behaviour, so keyboard users can leave the terminal.
      if (!input || matches.length === 0) return

      event.preventDefault()

      if (matches.length === 1) setInput(`${matches[0]} `)
      else print(matches.join('  '))
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
    }
  }

  return (
    <div className={styles.tp}>
      <div className={styles.tpHead}>
        <span className={cn(styles.tpTab, styles.tpTabOn)}>TERMINAL</span>
        <span className={styles.tpTab}>
          PROBLEMS <b>0</b>
        </span>
        <span className={cn(styles.tpTab, styles.hideSmall)}>OUTPUT</span>
        <span className={styles.tpShell}>zsh</span>
      </div>

      {/* Clicking anywhere in the terminal focuses the prompt, unless the visitor is selecting text. */}
      <div
        ref={bodyRef}
        className={styles.tpBody}
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
        }}
      >
        <div aria-live='polite'>
          {lines.map(line => (
            <div key={line.id} className={cn(styles.out, line.kind === 'cmd' && styles.cmdLine)}>
              {line.content}
            </div>
          ))}
        </div>
        <label className={styles.tpLine}>
          <span className={styles.prompt}>
            ~/kamycoding <span className={styles.kw}>$</span>
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete='off'
            autoCapitalize='off'
            spellCheck={false}
            aria-label={t('label')}
          />
        </label>
      </div>
    </div>
  )
}

export default Terminal
