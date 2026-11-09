'use client'

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { replayIntro } from '@/components/shell/boot'
import { wakeCat } from '@/hooks/use-cat'
import { closePalette, isPaletteOpen, openPalette, openThemePicker, usePalette } from '@/hooks/use-palette'
import { isReady } from '@/hooks/use-ready'
import { useSwitchLocale } from '@/hooks/use-switch-locale'
import { useRouter } from '@/i18n/navigation'
import { copyEmail, goToSection } from '@/lib/actions'
import type { SectionId } from '@/lib/sections'
import { getTheme, THEMES } from '@/lib/themes'

import styles from './palette.module.css'

// In the theme picker, preview names the theme an item shows while it is selected with the arrow keys.
type Command = Readonly<{ label: string; keys: string; run: () => void; preview?: string }>

type Group = Readonly<{ title: string; commands: readonly Command[] }>

// "G" then a letter jumps to a section, as in the prototype.
const SECTION_KEYS: Readonly<Record<string, SectionId>> = {
  w: 'work',
  a: 'about',
  s: 'stack',
  c: 'contact',
  g: 'index'
}

const G_WINDOW_MS = 900

const filterGroups = (groups: readonly Group[], query: string) => {
  const needle = query.trim().toLowerCase()

  return groups
    .map(group => ({
      ...group,
      commands: group.commands.filter(command => command.label.toLowerCase().includes(needle))
    }))
    .filter(group => group.commands.length > 0)
}

// Ctrl or Cmd K opens a command list; single keys run the same actions outside of text fields.
// In theme mode it is the Color Theme picker: arrows preview, Enter keeps, Escape restores, like VS Code.
const CommandPalette = () => {
  const t = useTranslations('palette')
  const tCommon = useTranslations('common')
  const switchLocale = useSwitchLocale()
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { open, mode, session } = usePalette()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [seenSession, setSeenSession] = useState(session)

  // The theme setting (maybe "system") and the shown theme when the picker opened, for Escape and the check mark.
  const [original, setOriginal] = useState({ setting: 'system', shown: 'dark' })
  const picking = mode === 'themes'

  // Every opening starts fresh; the picker preselects the theme that is shown right now.
  if (session !== seenSession) {
    const shown = getTheme(resolvedTheme).id

    setSeenSession(session)
    setQuery('')
    setSelected(mode === 'themes' ? THEMES.findIndex(item => item.id === shown) : 0)
    setOriginal({ setting: theme ?? 'system', shown })
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const gPressedAt = useRef(0)
  const listId = useId()

  // The legal pages have no sections, so the commands go to the home page there.
  const goTo = (id: SectionId) => {
    if (document.getElementById(id)) goToSection(id)
    else router.push(`/#${id}`)
  }

  const actions = {
    copy: () => void copyEmail(tCommon('copied')),
    language: () => switchLocale(),
    link: (url: string) => window.open(url, '_blank', 'noopener')
  }

  const groups: readonly Group[] = [
    {
      title: t('groups.nav'),
      commands: [
        { label: t('cmd.work'), keys: 'G W', run: () => goTo('work') },
        { label: t('cmd.about'), keys: 'G A', run: () => goTo('about') },
        { label: t('cmd.stack'), keys: 'G S', run: () => goTo('stack') },
        { label: t('cmd.contact'), keys: 'G C', run: () => goTo('contact') },
        { label: t('cmd.top'), keys: 'G G', run: () => goTo('index') }
      ]
    },
    {
      title: t('groups.actions'),
      commands: [
        { label: t('cmd.mail'), keys: 'C', run: actions.copy },
        { label: t('cmd.theme'), keys: 'T', run: openThemePicker },
        { label: t('cmd.lang'), keys: 'L', run: actions.language },
        { label: t('cmd.cat'), keys: 'M', run: wakeCat },
        { label: t('cmd.replay'), keys: 'R', run: replayIntro }
      ]
    },
    {
      title: t('groups.links'),
      commands: [
        { label: t('cmd.gh'), keys: '↗', run: () => actions.link('https://github.com/kamycoding') },
        { label: t('cmd.li'), keys: '↗', run: () => actions.link('https://www.linkedin.com/in/kamyarzamanfar') }
      ]
    }
  ]

  // Light themes first, then dark, as VS Code groups them. THEMES is in the same order, so indexes match.
  const themeGroups: readonly Group[] = (['light', 'dark'] as const).map(scheme => ({
    title: t(`themes.${scheme}`),
    commands: THEMES.filter(item => item.scheme === scheme).map(item => ({
      label: item.name,
      keys: item.id === original.shown ? '✓' : '',
      run: () => setTheme(item.id),
      preview: item.id
    }))
  }))

  const visible = filterGroups(picking ? themeGroups : groups, query)
  const flat = visible.flatMap(group => group.commands)

  const preview = (command: Command | undefined) => {
    if (command?.preview) setTheme(command.preview)
  }

  // Closing without a choice puts the theme back, including "follow the system".
  const close = () => {
    if (picking) setTheme(original.setting)

    closePalette()
  }

  const runCommand = (index: number) => {
    const command = flat[index]

    if (!command) return

    closePalette()
    command.run()
  }

  const select = (index: number) => {
    setSelected(index)

    if (picking) preview(flat[index])
  }

  // Focus moves into the palette and back to where it was, like the prototype.
  useEffect(() => {
    if (!open) return

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null

    inputRef.current?.focus()

    return () => previous?.focus()
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${selected}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, selected, listId])

  // Global shortcuts. They pause while the intro runs, a dialog is open or the visitor is typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()

        if (isPaletteOpen()) close()
        else openPalette()

        return
      }

      if (isPaletteOpen() || document.querySelector('[aria-modal="true"]') || !isReady()) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]')) return

      const key = event.key.toLowerCase()

      if (gPressedAt.current && Date.now() - gPressedAt.current < G_WINDOW_MS) {
        gPressedAt.current = 0

        if (SECTION_KEYS[key]) {
          event.preventDefault()
          goTo(SECTION_KEYS[key])
        }

        return
      }

      if (key === 'g') gPressedAt.current = Date.now()
      else if (key === 'c') actions.copy()
      else if (key === 't') openThemePicker()
      else if (key === 'l') actions.language()
      else if (key === 'm') wakeCat()
      else if (key === '?') openPalette()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (!open) return null

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const count = Math.max(1, flat.length)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      select((selected + 1) % count)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      select((selected - 1 + count) % count)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      runCommand(selected)
    } else if (event.key === 'Escape') {
      close()
    } else if (event.key === 'Tab') {
      // Focus stays in the palette while it is open.
      event.preventDefault()
    }
  }

  let index = -1

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label={picking ? t('themes.label') : t('label')}
      className={styles.backdrop}
      data-shell-ui=''
      onClick={event => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className={styles.pal}>
        <div className={styles.ih}>
          <span aria-hidden='true'>›</span>
          <input
            ref={inputRef}
            role='combobox'
            aria-expanded='true'
            aria-controls={listId}
            aria-activedescendant={flat.length > 0 ? `${listId}-${selected}` : undefined}
            aria-label={picking ? t('themes.placeholder') : t('placeholder')}
            placeholder={picking ? t('themes.placeholder') : t('placeholder')}
            autoComplete='off'
            spellCheck={false}
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setSelected(0)

              // Like VS Code, the first match is previewed while filtering themes.
              if (picking) preview(filterGroups(themeGroups, event.target.value)[0]?.commands[0])
            }}
            onKeyDown={onInputKeyDown}
          />
        </div>
        <ul id={listId} role='listbox' className={styles.list}>
          {visible.length === 0 && (
            <li role='presentation' className={styles.empty}>
              {picking ? t('themes.empty') : t('empty')}
            </li>
          )}
          {visible.map(group => (
            <li key={group.title} role='presentation'>
              <div className={styles.group}>{group.title}</div>
              <ul role='group' aria-label={group.title}>
                {group.commands.map(command => {
                  const position = ++index

                  return (
                    <li
                      key={command.label}
                      id={`${listId}-${position}`}
                      role='option'
                      aria-selected={position === selected}
                      className={styles.item}
                      onMouseMove={() => position !== selected && setSelected(position)}
                      onClick={() => runCommand(position)}
                    >
                      {command.label}
                      {command.keys && <kbd>{command.keys}</kbd>}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
        <div className={styles.foot} aria-hidden='true'>
          <span>↑↓ {picking ? t('themes.preview') : t('navigate')}</span>
          <span>↵ {picking ? t('themes.select') : t('run')}</span>
          <span>esc {picking ? t('themes.restore') : t('close')}</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
