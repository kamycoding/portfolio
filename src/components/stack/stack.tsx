import { getLocale, getTranslations } from 'next-intl/server'

import Section, { SectionHeading } from '@/components/shell/section'
import { CONTRIBUTIONS, PROFILE_LABEL, PROFILE_URL } from '@/content/activity'
import { SERVICES } from '@/content/services'
import { periodText, WEEKS } from '@/lib/contributions'
import { buildHeatmap } from '@/lib/heatmap'
import editor from '@/components/ui/editor.module.css'
import { cn } from '@/lib/utils'

import Heatmap from './heatmap'
import JsonTree from './json-tree'

import styles from './stack.module.css'

const SWATCHES = [styles.l0, styles.l1, styles.l2, styles.l3, styles.l4] as const

// stack.json in the prototype: foldable JSON tree, GitHub contribution heatmap, services as functions.
const Stack = async () => {
  const t = await getTranslations('stack')
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const heat = buildHeatmap(CONTRIBUTIONS, WEEKS)

  // Same formats as the prototype; UTC because the dates are calendar days.
  const intlLocale = locale === 'de' ? 'de-DE' : 'en-GB'
  const dayFormat = new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short', timeZone: 'UTC' })
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

      <div className={styles.grid}>
        <div className={editor.editor} data-shell-ui=''>
          <div className={editor.edHead}>
            <div className={editor.edTab}>
              <span className={cn(editor.badge, editor.badgeJs)}>{'{}'}</span>stack.json
            </div>
            <div className={editor.edPath}>{t('fold')}</div>
          </div>
          <JsonTree />
        </div>

        <div className={cn(editor.editor, styles.activity)} data-shell-ui=''>
          <div className={styles.actHead}>
            <b>{t('heat.total', { count: heat.total })}</b>
            <a href={PROFILE_URL} target='_blank' rel='noopener noreferrer'>
              {PROFILE_LABEL}
            </a>
          </div>
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
          <div className={styles.stats}>
            <div>
              <b>{heat.best}</b>
              <span>{t('stats.best')}</span>
            </div>
            <div>
              <b>{heat.streak}</b>
              <span>{t('stats.streak')}</span>
            </div>
            <div>
              <b>{heat.activeDays}</b>
              <span>{t('stats.days')}</span>
            </div>
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
