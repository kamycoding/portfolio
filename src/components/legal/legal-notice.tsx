import { getTranslations } from 'next-intl/server'

import { EMAIL } from '@/lib/actions'
import { getPage } from '@/lib/sections'

import LegalPage, { Paragraphs } from './legal-page'

// Text and personal data ported unchanged from v1 (main: src/app/pages/legal-notice).
const LegalNotice = async () => {
  const t = await getTranslations('legalNotice')
  const tLegal = await getTranslations('legal')

  const paragraphs = (key: 'contentLiability' | 'externalLinks' | 'copyright') => t.raw(`${key}.paragraphs`) as string[]

  return (
    <LegalPage
      page={getPage('/legal-notice')!}
      meta={tLegal('noticeMeta')}
      title={t('title')}
      updated={{ label: t('updated.label'), date: t('updated.date'), dateTime: '2026-08-10' }}
    >
      <section>
        <h2>{t('information.heading')}</h2>
        <address>
          <p>
            Kamyar Zamanfar
            <br />
            KamyCoding
          </p>
          <p>
            Alte Poststraße 14
            <br />
            53840 Troisdorf
            <br />
            {t('information.country')}
          </p>
        </address>
      </section>

      <section>
        <h2>{t('contact.heading')}</h2>
        <p>
          {t('contact.emailLabel')}: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </section>

      <section>
        <h2>{t('responsible.heading')}</h2>
        <p>
          Kamyar Zamanfar
          <br />
          {t('responsible.address')}
        </p>
      </section>

      <section>
        <h2>{t('contentLiability.heading')}</h2>
        <Paragraphs items={paragraphs('contentLiability')} />
      </section>

      <section>
        <h2>{t('externalLinks.heading')}</h2>
        <Paragraphs items={paragraphs('externalLinks')} />
      </section>

      <section>
        <h2>{t('copyright.heading')}</h2>
        <Paragraphs items={paragraphs('copyright')} />
      </section>
    </LegalPage>
  )
}

export default LegalNotice
