import { getLocale, getTranslations } from 'next-intl/server'

import Section, { SectionHeading } from '@/components/shell/section'
import { CONTRIBUTIONS, PROFILE_URL } from '@/content/activity'
import { SERVICES } from '@/content/services'
import { GITHUB_USER, periodText, WEEKS } from '@/lib/contributions'
import { buildHeatmap } from '@/lib/heatmap'
import editor from '@/components/ui/editor.module.css'
import { cn } from '@/lib/utils'

import Explorer from './explorer'
import Heatmap from './heatmap'

import styles from './stack.module.css'

const SWATCHES = [styles.l0, styles.l1, styles.l2, styles.l3, styles.l4] as const

// stack.json: the stack as an explorer, a year of GitHub contributions below it, services as functions.
const Stack = async () => {
  const t = await getTranslations('stack')
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const heat = buildHeatmap(CONTRIBUTIONS, WEEKS)

  // UTC because the dates are calendar days; the year matters since 52 weeks span two years.
  const intlLocale = locale === 'de' ? 'de-DE' : 'en-GB'

  const dayFormat = new Intl.DateTimeFormat(intlLocale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })

  const monthFormat = new Intl.DateTimeFormat(intlLocale, { month: 'short', timeZone: 'UTC' })

  const cells = heat.cells.map(cell => ({
    level: cell.level,
    future: cell.future,
    tip: t('heat.tip', { count: cell.count, date: dayFormat.format(Date.parse(cell.date)) })
  }))

  const months = heat.months.map(date => (date ? monthFormat.format(Date.parse(date)) : ''))

  return (
    <Section id='stack'>
      <SectionHeading id='stack' />

      <div className={styles.blocks}>
        <Explorer />

        <div className={editor.editor} data-shell-ui=''>
          <div className={editor.edHead}>
            <div className={editor.edTab}>
              <span className={cn(editor.badge, editor.badgeJs)}>{'{}'}</span>contributions.json
            </div>
            <a className={styles.profile} href={PROFILE_URL} target='_blank' rel='noopener noreferrer'>
              {/* Narrow screens hide the host visually only, so the link keeps its full name. */}
              <span className={styles.host}>github.com/</span>
              {GITHUB_USER}
              <span aria-hidden='true'> ↗</span>
            </a>
          </div>
          <div className={styles.activity}>
            <Heatmap
              cells={cells}
              months={months}
              days={[t('heat.mon'), t('heat.wed'), t('heat.fri')]}
              label={t('heat.label')}
            />
            <div className={styles.legend}>
              <span>
                {t('heat.note', {
                  period: periodText(CONTRIBUTIONS.start, CONTRIBUTIONS.end, intlLocale, t('heat.to'))
                })}
              </span>
              <span className={styles.swatches} aria-hidden='true'>
                <span>{t('heat.less')}</span>
                {SWATCHES.map(swatch => (
                  <i key={swatch} className={swatch} />
                ))}
                <span>{t('heat.more')}</span>
              </span>
            </div>
            <ul className={styles.stats}>
              <li>{t.rich('stats.total', { count: heat.total, b: chunks => <b>{chunks}</b> })}</li>
              <li>{t.rich('stats.best', { count: heat.best, b: chunks => <b>{chunks}</b> })}</li>
              <li>{t.rich('stats.streak', { count: heat.streak, b: chunks => <b>{chunks}</b> })}</li>
              <li>{t.rich('stats.days', { count: heat.activeDays, b: chunks => <b>{chunks}</b> })}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.services} data-shell-ui=''>
        {SERVICES.map(service => (
          <div key={service.fn} className={styles.svc}>
            <span className={styles.fn}>{service.fn}</span>
            <h3>{service[locale].title}</h3>
            <p>{service[locale].text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default Stack
