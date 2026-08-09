import type { Provider } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

const EN_TRANSLATIONS = {
  pageTitles: { notFound: 'Page Not Found | KamyCoding' },
  nav: {
    about: 'About me',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    homeAria: 'Go to homepage',
    primaryAria: 'Primary navigation',
    mobileAria: 'Mobile navigation',
    menuAria: 'Navigation menu',
    openMenuAria: 'Open navigation menu',
    closeMenuAria: 'Close navigation menu',
    switchToGerman: 'Switch language to German',
    switchToEnglish: 'Switch language to English',
  },
  footer: {
    aria: 'Site footer',
    homeAria: 'Go to the homepage',
    legalAria: 'Legal pages',
    linksAria: 'Footer links',
    legalNotice: 'Legal Notice',
    privacyPolicy: 'Privacy Policy',
  },
  social: {
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    emailLabel: 'Email',
    githubAria: 'Visit GitHub profile',
    linkedinAria: 'Visit LinkedIn profile',
    emailAria: 'Send an email',
  },
  contact: {
    fields: {
      name: {
        label: 'What’s your name?',
        placeholder: 'Your name goes here',
        required: 'Oops! It seems your name is missing.',
        maxlength: 'Please keep your name under 80 characters.',
      },
      email: {
        label: 'What’s your email?',
        placeholder: 'youremail@email.com',
        required: 'Oops! Your email is required.',
        invalid: 'Please enter a valid email address.',
        maxlength: 'Please keep your email under 254 characters.',
      },
      message: {
        label: 'How can I help you?',
        placeholder: 'Hello Kamyar, I am interested in…',
        required: 'What do you need to develop?',
        maxlength: 'Please keep your message under 2000 characters.',
      },
      honeypot: 'Leave this field empty',
    },
    privacy: {
      agreement: 'I agree to the processing of my data as outlined.',
      link: 'Read the privacy policy',
      required: 'Please accept the privacy policy.',
    },
    actions: { send: 'Send', sending: 'Sending…' },
    status: {
      sending: 'Sending your message…',
      success: 'Thank you! Your message has been sent.',
      error: 'Your message could not be sent. Please try again in a moment.',
    },
  },
  projects: {
    items: {
      join: {
        description: 'Join description',
        imageAlt: 'Join task manager displayed on a laptop',
        implementation: 'Join implementation',
        duration: '5 weeks',
      },
      elPolloLoco: {
        description: 'El Pollo Loco description',
        imageAlt: 'El Pollo Loco preview',
        implementation: 'El Pollo Loco implementation',
        duration: '3 weeks',
      },
      dabubble: {
        description: 'DABubble description',
        imageAlt: 'DABubble preview',
        implementation: 'DABubble implementation',
        duration: '4 weeks',
      },
    },
  },
  projectDetail: {
    navigationAria: 'Project navigation',
    back: 'Go Back',
    next: 'Next Project',
    nextAria: 'View next project: {{project}}',
    description: 'Description',
    implementation: 'Implementation Details',
    duration: 'Duration:',
    technologiesAria: 'Technologies used',
    previewAria: '{{project}} preview',
    featuredAlt: 'Featured project',
    linksAria: 'Project links',
    liveTest: 'Live Test',
  },
  notFound: {
    code: 'Error 404',
    heading: 'Page not found',
    description: 'The page you’re looking for doesn’t exist or may have moved.',
    navigationAria: 'Not found page navigation',
    home: 'Back to homepage',
    projects: 'View projects',
  },
  legalUi: { back: 'Back' },
} as const;

const DE_TRANSLATIONS = {
  ...EN_TRANSLATIONS,
  pageTitles: { notFound: 'Seite nicht gefunden | KamyCoding' },
  nav: {
    ...EN_TRANSLATIONS.nav,
    about: 'Über mich',
    projects: 'Projekte',
    contact: 'Kontakt',
    switchToGerman: 'Sprache auf Deutsch umstellen',
    switchToEnglish: 'Sprache auf Englisch umstellen',
  },
  footer: {
    ...EN_TRANSLATIONS.footer,
    legalNotice: 'Impressum',
    privacyPolicy: 'Datenschutzerklärung',
  },
  legalUi: { back: 'Zurück' },
} as const;

export function provideTestTranslateService(): Provider[] {
  return provideTranslateService({ fallbackLang: 'en' });
}

export async function setTestLanguage(
  translate: TranslateService,
  language: 'en' | 'de' = 'en',
): Promise<void> {
  translate.setTranslation('en', EN_TRANSLATIONS);
  translate.setTranslation('de', DE_TRANSLATIONS);
  await firstValueFrom(translate.use(language));
}
