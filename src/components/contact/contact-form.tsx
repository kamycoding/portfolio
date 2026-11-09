'use client'

import { type FormEvent, type KeyboardEvent, type ReactNode, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import Cat from '@/components/cat/cat'
import editor from '@/components/ui/editor.module.css'
import { wakeCat } from '@/hooks/use-cat'
import { useCologneTime } from '@/hooks/use-cologne-time'
import { useModKey } from '@/hooks/use-mod-key'
import { Link } from '@/i18n/navigation'
import { CONTACT_LIMITS, type ContactField, invalidContactFields } from '@/lib/contact/contact-schema'
import { cn } from '@/lib/utils'

import styles from './contact.module.css'

const ENDPOINT = '/api/contact'

type Values = Readonly<{
  name: string
  email: string
  message: string
  privacyAccepted: boolean
  company: string
}>

const EMPTY: Values = { name: '', email: '', message: '', privacyAccepted: false, company: '' }

const INPUT_ID: Readonly<Record<ContactField, string>> = {
  name: 'f-name',
  email: 'f-email',
  message: 'f-message',
  privacyAccepted: 'f-privacy'
}

type Line = Readonly<{ tone: 'plain' | 'dim' | 'ok' | 'err'; text: string }>

const TONE_CLASS = { plain: undefined, dim: styles.dim, ok: styles.ok, err: styles.bad2 } as const

const RUN_LINE: Line = { tone: 'plain', text: '> sendMessage()' }

type FieldRowProps = Readonly<{
  n: number
  field: ContactField
  invalid: boolean
  error: string
  className?: string
  children: ReactNode
}>

// One code line per field; the error sits below it like a TypeScript diagnostic.
const FieldRow = ({ n, field, invalid, error, className, children }: FieldRowProps) => (
  <>
    <div className={cn(styles.fl, styles.field, invalid && styles.bad)}>
      <span aria-hidden='true' className={styles.n}>
        {n}
      </span>
      <span className={cn(styles.c, className)}>{children}</span>
    </div>
    {invalid && (
      <p id={`e-${field}`} className={styles.err}>
        {error}
      </p>
    )}
  </>
)

// sendMessage({ ... }) from the prototype, validated with the schema the Netlify function uses.
const ContactForm = () => {
  const t = useTranslations('contact')
  const modKey = useModKey()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>(EMPTY)
  const [tried, setTried] = useState(false)
  const [sending, setSending] = useState(false)
  const [output, setOutput] = useState<readonly Line[]>([{ tone: 'dim', text: t('out.idle') }])

  // Errors appear after the first submit and then update while typing, as in the prototype.
  const invalid = new Set(tried ? invalidContactFields(values) : [])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues(current => ({ ...current, [key]: value }))

  const describe = (field: ContactField) =>
    invalid.has(field) ? { 'aria-invalid': true, 'aria-describedby': `e-${field}` } : { 'aria-invalid': false }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (sending) return

    setTried(true)

    const failed = invalidContactFields(values)

    if (failed.length > 0) {
      setOutput([
        RUN_LINE,
        { tone: 'err', text: failed.length === 1 ? t('out.fail') : t('out.fails', { count: failed.length }) }
      ])
      document.getElementById(INPUT_ID[failed[0]])?.focus()

      return
    }

    setSending(true)
    setOutput([RUN_LINE, { tone: 'dim', text: `POST ${ENDPOINT} …` }])

    let status: number | undefined

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values)
      })

      status = response.status
    } catch {
      status = undefined
    }

    const request: Line = {
      tone: 'dim',
      text: status === undefined ? `POST ${ENDPOINT}` : `POST ${ENDPOINT} ${status}`
    }

    if (status === 200) {
      setOutput([RUN_LINE, request, { tone: 'ok', text: t('out.success') }])
      setValues(EMPTY)
      setTried(false)
      wakeCat()
    } else {
      setOutput([RUN_LINE, request, { tone: 'err', text: status === 429 ? t('out.rateLimited') : t('out.error') }])
    }

    setSending(false)
  }

  // Ctrl or Cmd plus Enter runs the form from any field, like running code in an editor.
  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <form
      ref={formRef}
      noValidate
      className={cn(editor.editor, styles.form)}
      data-shell-ui=''
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
    >
      <Cat className={styles.cat} announce={false} />
      <div className={editor.edHead}>
        <div className={editor.edTab}>
          <span className={editor.badge}>TS</span>contact.ts
        </div>
        <div className={editor.edPath}>sendMessage()</div>
      </div>

      <div className={styles.fcode}>
        <div aria-hidden='true' className={styles.fl}>
          <span className={styles.n}>1</span>
          <span className={styles.c}>
            <span className={styles.kw}>await</span> sendMessage{'({'}
          </span>
        </div>

        <FieldRow n={2} field='name' invalid={invalid.has('name')} error={t('errors.name')}>
          <label htmlFor={INPUT_ID.name}>
            <span className={styles.prop}>name</span>
            <span className={styles.pun}>:</span>
          </label>
          <span className={styles.inp}>
            <input
              id={INPUT_ID.name}
              name='name'
              autoComplete='name'
              maxLength={CONTACT_LIMITS.name.max}
              placeholder={t('placeholders.name')}
              value={values.name}
              onChange={event => set('name', event.target.value)}
              {...describe('name')}
            />
          </span>
        </FieldRow>

        <FieldRow n={3} field='email' invalid={invalid.has('email')} error={t('errors.email')}>
          <label htmlFor={INPUT_ID.email}>
            <span className={styles.prop}>email</span>
            <span className={styles.pun}>:</span>
          </label>
          <span className={styles.inp}>
            <input
              id={INPUT_ID.email}
              name='email'
              type='email'
              autoComplete='email'
              maxLength={CONTACT_LIMITS.email.max}
              placeholder={t('placeholders.email')}
              value={values.email}
              onChange={event => set('email', event.target.value)}
              {...describe('email')}
            />
          </span>
        </FieldRow>

        <FieldRow n={4} field='message' invalid={invalid.has('message')} error={t('errors.message')}>
          <label htmlFor={INPUT_ID.message}>
            <span className={styles.prop}>message</span>
            <span className={styles.pun}>:</span>
          </label>
          <span className={styles.inp}>
            <textarea
              id={INPUT_ID.message}
              name='message'
              maxLength={CONTACT_LIMITS.message.max}
              placeholder={t('placeholders.message')}
              value={values.message}
              onChange={event => set('message', event.target.value)}
              {...describe('message')}
            />
            <span aria-hidden='true' className={styles.count}>
              {values.message.length} / {CONTACT_LIMITS.message.max}
            </span>
          </span>
        </FieldRow>

        <FieldRow
          n={5}
          field='privacyAccepted'
          invalid={invalid.has('privacyAccepted')}
          error={t('errors.privacyAccepted')}
          className={styles.checkRow}
        >
          <label className={styles.check} data-cursor=''>
            <input
              id={INPUT_ID.privacyAccepted}
              type='checkbox'
              name='privacyAccepted'
              checked={values.privacyAccepted}
              onChange={event => set('privacyAccepted', event.target.checked)}
              {...describe('privacyAccepted')}
            />
            <span>
              {t.rich('privacy', {
                // A new tab keeps what the visitor has typed so far.
                link: chunks => (
                  <Link href='/privacy-policy' target='_blank' rel='noopener'>
                    {chunks}
                  </Link>
                )
              })}
            </span>
          </label>
        </FieldRow>

        {/* Honeypot, sent as "company". A neutral name and display: none keep browser autofill out of it. */}
        <div className={styles.honeypot} aria-hidden='true'>
          <label>
            {t('honeypot')}
            <input
              name='hp_contact'
              tabIndex={-1}
              autoComplete='off'
              value={values.company}
              onChange={event => set('company', event.target.value)}
            />
          </label>
        </div>

        <div aria-hidden='true' className={styles.fl}>
          <span className={styles.n}>6</span>
          <span className={styles.c}>{'})'}</span>
        </div>
      </div>

      <div className={styles.runbar}>
        <span className={styles.hint}>{t('hint')}</span>
        <button type='submit' className={styles.run} disabled={sending} aria-busy={sending} data-cursor='run'>
          <span aria-hidden='true'>▶</span>
          {t('send')}
          <span aria-hidden='true' className={styles.k}>
            {modKey} ↵
          </span>
        </button>
      </div>

      {/* Text only, never HTML (ADR 0005). */}
      <div className={styles.out} aria-live='polite'>
        {output.map((line, index) => (
          <div key={index} className={TONE_CLASS[line.tone]}>
            {line.text}
          </div>
        ))}
      </div>
    </form>
  )
}

// Cologne time with its zone for the direct links (prototype #clock2).
export const ContactClock = () => <span>{useCologneTime(true)}</span>

export default ContactForm
