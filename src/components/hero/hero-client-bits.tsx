'use client'

import { useTranslations } from 'next-intl'

import { useCologneTime } from '@/hooks/use-cologne-time'
import { copyEmail } from '@/lib/actions'

import ui from '@/components/ui/ui.module.css'

// The two interactive bits of the otherwise static hero column.
export const CopyEmailButton = () => {
  const t = useTranslations('hero.cta')
  const tCommon = useTranslations('common')

  return (
    <button type='button' className={ui.btn} onClick={() => void copyEmail(tCommon('copied'))}>
      <span>{t('copyEmail')}</span>
      <span className={ui.key}>C</span>
    </button>
  )
}

export const NowClock = () => <>{useCologneTime()}</>
