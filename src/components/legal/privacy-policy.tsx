import { getTranslations } from 'next-intl/server'

import { EMAIL } from '@/lib/actions'
import { getPage } from '@/lib/sections'

import LegalPage, { List, Paragraphs } from './legal-page'

// Ported unchanged from v1 (main: src/app/pages/privacy-policy), except section 10, which describes the v2 storage.
const PrivacyPolicy = async () => {
  const t = await getTranslations('privacyPolicy')
  const tLegal = await getTranslations('legal')
  const raw = (key: Parameters<typeof t.raw>[0]) => t.raw(key) as string[]

  return (
    <LegalPage
      page={getPage('/privacy-policy')!}
      meta={tLegal('privacyMeta')}
      title={t('title')}
      updated={{ label: t('updated.label'), date: t('updated.date'), dateTime: '2026-08-10' }}
    >
      <section>
        <h2>{t('controller.heading')}</h2>
        <p>{t('controller.intro')}</p>
        <address>
          Kamyar Zamanfar
          <br />
          KamyCoding
          <br />
          <br />
          Alte Poststraße 14
          <br />
          53840 Troisdorf
          <br />
          {t('controller.country')}
        </address>
        <p>
          {t('common.emailLabel')}: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </section>

      <section>
        <h2>{t('general.heading')}</h2>
        <Paragraphs items={raw('general.paragraphs')} />
      </section>

      <section>
        <h2>{t('netlify.heading')}</h2>
        <p>{t('netlify.intro')}</p>
        <p>{t('common.provider')}:</p>
        <address>
          Netlify, Inc.
          <br />
          101 2nd Street
          <br />
          San Francisco, CA 94105
          <br />
          USA
        </address>
        <Paragraphs items={raw('netlify.beforeList')} />
        <List items={raw('netlify.items')} />
        <Paragraphs items={raw('netlify.afterList')} />
      </section>

      <section>
        <h2>{t('backend.heading')}</h2>
        <p>{t('backend.intro')}</p>
        <Paragraphs items={raw('backend.beforeList')} />
        <List items={raw('backend.items')} />
        <Paragraphs items={raw('backend.afterList')} />
      </section>

      <section>
        <h2>{t('contactForm.heading')}</h2>
        <Paragraphs items={raw('contactForm.beforeList')} />
        <List items={raw('contactForm.items')} />
        <Paragraphs items={raw('contactForm.afterList')} />
      </section>

      <section>
        <h2>{t('validation.heading')}</h2>
        <Paragraphs items={raw('validation.paragraphs')} />
      </section>

      <section>
        <h2>{t('brevo.heading')}</h2>
        <Paragraphs items={raw('brevo.beforeList')} />
        <List items={raw('brevo.items')} />
        <Paragraphs items={raw('brevo.afterList')} />
      </section>

      <section>
        <h2>{t('zoho.heading')}</h2>
        <Paragraphs items={raw('zoho.beforeAddress')} />
        <address>
          Zoho Corporation B.V.
          <br />
          Beneluxlaan 4B
          <br />
          3527 HT Utrecht
          <br />
          {t('zoho.country')}
        </address>
        <Paragraphs items={raw('zoho.beforeList')} />
        <List items={raw('zoho.items')} />
        <Paragraphs items={raw('zoho.afterList')} />
      </section>

      <section>
        <h2>{t('retention.heading')}</h2>
        <Paragraphs items={raw('retention.paragraphs')} />
      </section>

      <section>
        <h2>{t('languagePreference.heading')}</h2>
        <Paragraphs items={raw('languagePreference.paragraphs')} />
      </section>

      <section>
        <h2>{t('tracking.heading')}</h2>
        <Paragraphs items={raw('tracking.paragraphs')} />
      </section>

      <section>
        <h2>{t('encryption.heading')}</h2>
        <Paragraphs items={raw('encryption.paragraphs')} />
      </section>

      <section>
        <h2>{t('recipients.heading')}</h2>
        <p>{t('recipients.intro')}</p>
        <p>{t('recipients.listIntro')}:</p>
        <List items={raw('recipients.items')} />
        <p>{t('recipients.outro')}</p>
      </section>

      <section>
        <h2>{t('rights.heading')}</h2>
        <p>{t('rights.intro')}:</p>
        <List items={raw('rights.items')} />
        <p>{t('rights.outro')}</p>
      </section>

      <section>
        <h2>{t('objection.heading')}</h2>
        <p>{t('objection.body')}</p>
      </section>

      <section>
        <h2>{t('complaint.heading')}</h2>
        <Paragraphs items={raw('complaint.paragraphs')} />
      </section>

      <section>
        <h2>{t('automatedDecisionMaking.heading')}</h2>
        <p>{t('automatedDecisionMaking.body')}</p>
      </section>

      <section>
        <h2>{t('changes.heading')}</h2>
        <Paragraphs items={raw('changes.paragraphs')} />
      </section>
    </LegalPage>
  )
}

export default PrivacyPolicy
