import { getTranslations } from 'next-intl/server'

import Section, { SectionHeading } from '@/components/shell/section'
import { EMAIL } from '@/lib/actions'

import ContactForm, { ContactClock } from './contact-form'

import styles from './contact.module.css'

// contact.ts in the prototype: direct links on the left, the sendMessage() form on the right.
const Contact = async () => {
  const t = await getTranslations('contact')

  return (
    <Section id='contact'>
      <div className={styles.contact}>
        <div>
          <SectionHeading id='contact' intro={t('intro')} />
          <div className={styles.direct}>
            <a href={`mailto:${EMAIL}`}>
              <span className={styles.lead}>{EMAIL}</span>
              <span className={styles.arr}>mail ↗</span>
            </a>
            <a href='https://www.linkedin.com/in/kamyarzamanfar' target='_blank' rel='noopener noreferrer'>
              LinkedIn<span className={styles.arr}>/in/kamyarzamanfar ↗</span>
            </a>
            <a href='https://github.com/kamycoding' target='_blank' rel='noopener noreferrer'>
              GitHub<span className={styles.arr}>/kamycoding ↗</span>
            </a>
            <div>
              <span className={styles.lead}>{t('where')}</span>
              <ContactClock />
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  )
}

export default Contact
