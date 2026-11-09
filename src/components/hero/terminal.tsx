'use client'

import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { CONTRIBUTIONS, PROFILE_URL } from '@/content/activity'
import { PROJECTS } from '@/content/projects'
import { animateBuild, getBlueprint } from '@/hooks/use-blueprint'
import { wakeCat } from '@/hooks/use-cat'
import { openProject } from '@/hooks/use-project-drawer'
import { useReady } from '@/hooks/use-ready'
import { useSwitchLocale } from '@/hooks/use-switch-locale'
import { goToSection, prefersReducedMotion } from '@/lib/actions'
import { BUILD_MAX, planPercent } from '@/lib/blueprint'
import { GITHUB_USER, periodText, WEEKS } from '@/lib/contributions'
import { buildHeatmap } from '@/lib/heatmap'
import { SECTIONS } from '@/lib/sections'
import { parseCommand, suggest } from '@/lib/terminal'
import { findTheme, getTheme, isDarkTheme, THEMES } from '@/lib/themes'
import { cn } from '@/lib/utils'

import styles from './hero.module.css'

// Intro lines are marked, so a language switch can reprint them without touching the visitor's own commands.
type Line = Readonly<{ id: number; kind: 'cmd' | 'out'; content: ReactNode; intro?: boolean }>

// The plan view from `blueprint` keeps the left 40% built, so the prompt stays visible while typing.
const PLAN_VIEW_BUILD = 40

// Output and history survive a language switch (which remounts the page), like the prototype's single page.
let savedLines: Line[] = []
let nextId = 1
let introDone = false
let introLocale: string | null = null
let lastFailed = false
const history: string[] = []
let historyIndex = 0
const listeners = new Set<() => void>()

const setLines = (next: Line[]) => {
  savedLines = next
  listeners.forEach(listener => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const bold = (chunks: ReactNode) => <b>{chunks}</b>

// Path, branch segment and a chevron that turns red after a failed command, like modern shell prompts.
const Prompt = ({ failed }: Readonly<{ failed: boolean }>) => (
  <span aria-hidden='true' className={styles.prompt}>
    <span className={styles.kw}>~/kamycoding</span> <span className={styles.ok}>main ✓</span>{' '}
    <span className={failed ? styles.err : styles.ok}>❯</span>
  </span>
)

const Terminal = () => {
  const t = useTranslations('hero.terminal')
  const tStack = useTranslations('stack.heat')
  const locale = useLocale()
  const switchLocale = useSwitchLocale()
  const { resolvedTheme, setTheme } = useTheme()
  const ready = useReady()

  const lines = useSyncExternalStore(
    subscribe,
    () => savedLines,
    () => savedLines
  )

  const [input, setInput] = useState('')
  const [failed, setFailed] = useState(lastFailed)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestion = suggest(input, history)
  const ghost = suggestion ? suggestion.slice(input.length) : ''

  const print = (content: ReactNode, kind: Line['kind'] = 'out') =>
    setLines([...savedLines, { id: nextId++, kind, content }])

  const echo = (line: string, suffix = '') =>
    print(
      <>
        <Prompt failed={lastFailed} /> {line}
        {suffix}
      </>,
      'cmd'
    )

  const finish = (ok: boolean) => {
    lastFailed = !ok
    setFailed(!ok)
  }

  const fail = (content: ReactNode) => {
    print(<span className={styles.err}>{content}</span>)
    finish(false)
  }

  // Sections and projects print as buttons, so the listing doubles as navigation.
  const listSections = () =>
    print(
      <>
        {SECTIONS.map(section => (
          <span key={section.id}>
            <button type='button' className={styles.outLink} onClick={() => goToSection(section.id)}>
              {section.file}
            </button>
            {'  '}
          </span>
        ))}
        <button type='button' className={styles.outLink} onClick={() => run('ls projects')}>
          projects/
        </button>
      </>
    )

  const listProjects = () =>
    print(
      PROJECTS.map((project, index) => (
        <span key={project.id}>
          {index > 0 && '\n'}
          <button
            type='button'
            aria-haspopup='dialog'
            className={styles.outLink}
            onClick={event => openProject(index, event.currentTarget)}
          >
            {project.id}/
          </button>
          {'  '}
          {project[locale === 'de' ? 'de' : 'en'].tag}
        </span>
      ))
    )

  // One button per VS Code theme; the shown one is marked.
  const listThemes = () => {
    const shown = getTheme(resolvedTheme).id

    print(
      THEMES.map((item, index) => (
        <span key={item.id}>
          {index > 0 && '\n'}
          <span className={styles.ok}>{item.id === shown ? '●' : ' '}</span>{' '}
          <button
            type='button'
            className={styles.outLink}
            onClick={() => {
              setTheme(item.id)
              print(`theme: ${item.name}`)
            }}
          >
            {item.name}
          </button>
          {'  '}
          <span className={styles.dim}>{item.id}</span>
        </span>
      ))
    )
  }

  // Real numbers from the committed GitHub snapshot, the same source as the heatmap in stack.json.
  const gitLog = () => {
    const heat = buildHeatmap(CONTRIBUTIONS, WEEKS)
    const intlLocale = locale === 'de' ? 'de-DE' : 'en-GB'

    print(
      <>
        <span className={styles.str}>*</span>{' '}
        {t.rich('gitLog.total', {
          b: bold,
          count: heat.total,
          period: periodText(CONTRIBUTIONS.start, CONTRIBUTIONS.end, intlLocale, tStack('to'))
        })}
        {'\n  '}
        {t.rich('gitLog.stats', { b: bold, best: heat.best, streak: heat.streak, days: heat.activeDays })}
        {'\n  '}
        <a href={PROFILE_URL} target='_blank' rel='noopener noreferrer' className={styles.outLink}>
          github.com/{GITHUB_USER}
        </a>
      </>
    )
  }

  const run = (raw: string) => {
    const line = raw.trim()

    echo(line)

    if (!line) return

    history.push(line)
    historyIndex = history.length

    const { name, arg } = parseCommand(line)

    // Most commands succeed; the branches that fail say so through fail().
    finish(true)

    switch (name) {
      case 'help':
        return print(t.rich('help', { b: bold }))
      case 'whoami':
        return print(t.rich('whoami', { b: bold }))
      case 'ls':
        if (!arg || arg === '.') return listSections()

        if (arg === 'projects' || arg === 'projects/') return listProjects()

        return fail(t('lsMissing', { path: arg }))
      case 'git':
        return arg === 'log' ? gitLog() : fail(t('gitUsage'))

      case 'blueprint': {
        const toPlan = getBlueprint().build >= BUILD_MAX

        animateBuild(toPlan ? PLAN_VIEW_BUILD : BUILD_MAX, 700)

        return print(toPlan ? t('blueprintOn', { value: planPercent(PLAN_VIEW_BUILD) }) : t('blueprintOff'))
      }

      case 'theme': {
        if (arg === 'list') return listThemes()

        // Without a name it stays a quick dark/light toggle; Monokai and Solarized count as dark.
        const next = arg ? findTheme(arg) : isDarkTheme(resolvedTheme) ? 'light' : 'dark'

        if (!next) return fail(t('themeUsage'))

        setTheme(next)

        return print(`theme: ${getTheme(next).name}`)
      }

      case 'lang': {
        if (arg && arg !== 'de' && arg !== 'en') return fail(t('langUsage'))

        const next = (arg || (locale === 'en' ? 'de' : 'en')) as 'en' | 'de'

        print(`lang: ${next}`)

        if (next !== locale) switchLocale(next)

        return
      }

      case 'contact':
        print(
          <>
            <span className={styles.ok}>→</span> contact.ts
          </>
        )
        goToSection('contact')

        // The visitor asked for the form, so its first field takes focus; preventScroll keeps the smooth scroll.
        document.getElementById('f-name')?.focus({ preventScroll: true })

        return
      case 'pet':
        if (arg !== 'cat') return fail(t('petUsage'))

        wakeCat()

        return print(t('cat'))

      case 'clear':
        return setLines([])
      case 'sudo':
        if (!arg.startsWith('hire')) return fail(t('sudoNo'))

        print(<span className={styles.ok}>{t('sudo')}</span>)
        window.setTimeout(() => goToSection('contact'), 700)

        return
      default:
        fail(
          <>
            zsh: command not found: {name} <span className={styles.dim}>{t('tryHelp')}</span>
          </>
        )
    }
  }

  // "whoami" with its answer and the hint, in the current language.
  const introLines = (): Line[] => [
    {
      id: nextId++,
      kind: 'cmd',
      intro: true,
      content: (
        <>
          <Prompt failed={false} /> whoami
        </>
      )
    },
    { id: nextId++, kind: 'out', intro: true, content: t.rich('whoami', { b: bold }) },
    { id: nextId++, kind: 'out', intro: true, content: <span className={styles.dim}>{t('hint')}</span> }
  ]

  // After a language switch the intro is printed again in the new language; the visitor's lines stay.
  useEffect(() => {
    if (!introDone || introLocale === null || introLocale === locale) return

    introLocale = locale
    setLines([...introLines(), ...savedLines.filter(line => !line.intro)])

    // introLines only reads the current translations, so the switch is the only trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  // The prototype types "whoami" once, after the intro. Only the value changes: no focus, no page scroll.
  useEffect(() => {
    if (!ready || introDone || savedLines.length > 0) return

    const done = () => {
      introDone = true
      introLocale = locale
      setInput('')
      setLines([...savedLines, ...introLines()])
    }

    if (prefersReducedMotion()) {
      const timer = window.setTimeout(done, 0)

      return () => window.clearTimeout(timer)
    }

    const command = 'whoami'
    const timers: number[] = []

    for (let index = 1; index <= command.length; index++) {
      timers.push(window.setTimeout(() => setInput(command.slice(0, index)), 900 + index * 70))
    }

    timers.push(window.setTimeout(done, 900 + command.length * 70 + 260))

    return () => timers.forEach(timer => window.clearTimeout(timer))

    // run and print only read the current store, so the intro does not need them as dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // Keep the newest output in view by scrolling the terminal body only, never the page.
  useEffect(() => {
    const body = bodyRef.current

    if (body) body.scrollTop = body.scrollHeight
  }, [lines])

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const field = event.currentTarget
    const atEnd = field.selectionStart === input.length && field.selectionEnd === input.length

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
    } else if ((event.key === 'Tab' || (event.key === 'ArrowRight' && atEnd)) && suggestion) {
      // Without a suggestion Tab keeps its normal job, so keyboard users can leave the terminal.
      event.preventDefault()
      setInput(suggestion)
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
    } else if (event.key === 'c' && event.ctrlKey && field.selectionStart === field.selectionEnd) {
      // Ctrl+C cancels the line like a shell; with text selected it still copies.
      event.preventDefault()
      echo(input, '^C')
      setInput('')
      historyIndex = history.length
    }
  }

  return (
    <div className={styles.tp} data-bp='terminal'>
      <div className={styles.tpHead}>
        <span className={cn(styles.tpTab, styles.tpTabOn)}>TERMINAL</span>
        <span className={styles.tpTab}>
          PROBLEMS <b>0</b>
        </span>
        <span className={cn(styles.tpTab, styles.hideSmall)}>OUTPUT</span>
        <span className={styles.tpShell}>zsh</span>
      </div>

      {/* Clicking the terminal background focuses the prompt, unless the visitor selects text or clicks a link. */}
      <div
        ref={bodyRef}
        data-cursor='text'
        className={styles.tpBody}
        onClick={event => {
          if ((event.target as HTMLElement).closest('a, button') || window.getSelection()?.toString()) return

          inputRef.current?.focus({ preventScroll: true })
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
          <Prompt failed={failed} />
          <span className='sr-only'>{t('label')}</span>
          <span className={styles.tpField}>
            <input
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete='off'
              autoCapitalize='off'
              spellCheck={false}
              enterKeyHint='send'
            />
            {/* The typed part is invisible and only positions the grey rest of the suggestion. */}
            <span aria-hidden='true' className={styles.ghost}>
              <span className={styles.ghostTyped}>{input}</span>
              {ghost}
            </span>
          </span>
        </label>
      </div>
    </div>
  )
}

export default Terminal
