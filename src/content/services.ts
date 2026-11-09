// Services as functions, from the approved prototype (docs/design/prototype/app.js SERVICES).
type ServiceCopy = Readonly<{ title: string; text: string }>

export type Service = Readonly<{
  fn: string
  en: ServiceCopy
  de: ServiceCopy
}>

export const SERVICES: readonly Service[] = [
  {
    fn: 'frontend()',
    en: {
      title: 'Frontend development',
      text: 'Fast, accessible interfaces in React, Next.js or Angular, built from your design or together with you.'
    },
    de: {
      title: 'Frontend-Entwicklung',
      text: 'Schnelle, barrierearme Oberflächen mit React, Next.js oder Angular, nach deinem Design oder gemeinsam entworfen.'
    }
  },
  {
    fn: 'fullstack()',
    en: {
      title: 'Full-stack web apps',
      text: 'From database to UI: APIs, auth and data with Node, NestJS, PostgreSQL or Supabase.'
    },
    de: {
      title: 'Full-Stack-Web-Apps',
      text: 'Von der Datenbank bis zur UI: APIs, Auth und Daten mit Node, NestJS, PostgreSQL oder Supabase.'
    }
  },
  {
    fn: 'mvp()',
    en: {
      title: 'MVPs and products',
      text: 'I help shape scope, roadmap and architecture, then build a first version real users can try.'
    },
    de: {
      title: 'MVPs und Produkte',
      text: 'Ich helfe bei Umfang, Roadmap und Architektur und baue eine erste Version, die echte Nutzer testen können.'
    }
  },
  {
    fn: 'fromFigma()',
    en: {
      title: 'Design to code',
      text: 'Careful implementation of Figma designs, with design systems and reusable components.'
    },
    de: {
      title: 'Design to Code',
      text: 'Sorgfältige Umsetzung von Figma-Designs, mit Designsystem und wiederverwendbaren Komponenten.'
    }
  }
]
