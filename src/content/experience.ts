// Experience as git commits, from the approved prototype (docs/design/prototype/app.js COMMITS).
export type CommitCopy = Readonly<{
  when: string
  scope: string
  title: string
  role: string
  text: string
  diff: readonly string[]
}>

export type Commit = Readonly<{
  hash: string
  refs: ReadonlyArray<readonly ['head' | 'br' | 'tag', string]>
  head?: boolean
  stack: readonly string[]
  en: CommitCopy
  de: CommitCopy
}>

export const COMMITS: readonly Commit[] = [
  {
    hash: 'e4c1a9f',
    refs: [['head', 'HEAD → main']],
    head: true,
    stack: ['Next.js', 'React', 'TypeScript', 'NestJS', 'PostgreSQL'],
    en: {
      when: '2026 → today',
      scope: 'feat(heldio):',
      title: 'co-found an AI language learning platform',
      role: 'Co-founder & Frontend Developer',
      text: 'An AI-powered platform for contextual language learning. I lead the product concept, MVP scope and roadmap, and build the frontend of the responsive web platform.',
      diff: ['+ shaped the MVP from first concept to a working learning loop']
    },
    de: {
      when: '2026 → heute',
      scope: 'feat(heldio):',
      title: 'KI-Plattform zum Sprachenlernen mitgründen',
      role: 'Mitgründer & Frontend-Entwickler',
      text: 'Eine KI-Plattform für kontextbezogenes Sprachenlernen. Ich verantworte Produktkonzept, MVP-Umfang und Roadmap und baue das Frontend der responsiven Web-Plattform.',
      diff: ['+ MVP vom ersten Konzept bis zur funktionierenden Lernschleife geformt']
    }
  },
  {
    hash: '9b27d40',
    refs: [
      ['br', 'training'],
      ['tag', 'frontend-cert']
    ],
    stack: ['Angular', 'TypeScript', 'Supabase', 'Python', 'Django'],
    en: {
      when: 'ongoing',
      scope: 'feat(developer-akademie):',
      title: 'full-stack and AI software developer training',
      role: 'Developer Akademie',
      text: 'Intensive training with team projects, code reviews and real deadlines. Front-end part completed, now working through the backend and AI modules.',
      diff: ['+ front-end certificate, 18 Sep 2026', '+ shipped Join with a team']
    },
    de: {
      when: 'laufend',
      scope: 'feat(developer-akademie):',
      title: 'Weiterbildung zum Full-Stack- und KI-Softwareentwickler',
      role: 'Developer Akademie',
      text: 'Intensive Weiterbildung mit Teamprojekten, Code-Reviews und echten Deadlines. Der Frontend-Teil ist abgeschlossen, jetzt folgen Backend und KI.',
      diff: ['+ Frontend-Zertifikat, 18.09.2026', '+ Join im Team ausgeliefert']
    }
  },
  {
    hash: '51f0c3e',
    refs: [],
    stack: ['React', 'TypeScript'],
    en: {
      when: 'Jun → Nov 2025',
      scope: 'feat(osifyai):',
      title: 'freelance frontend for medical AI software',
      role: 'Freelance Frontend Developer',
      text: 'AI software for medical practices. I worked on the design system and the React components behind the patient and doctor dashboards.',
      diff: ['+ reusable React components for patient and doctor dashboards']
    },
    de: {
      when: 'Jun → Nov 2025',
      scope: 'feat(osifyai):',
      title: 'Freelance-Frontend für medizinische KI-Software',
      role: 'Freelance Frontend-Entwickler',
      text: 'KI-Software für Arztpraxen. Ich habe am Designsystem und an den React-Komponenten für die Patienten- und Ärzte-Dashboards gearbeitet.',
      diff: ['+ wiederverwendbare React-Komponenten für Patienten- und Ärzte-Dashboards']
    }
  },
  {
    hash: '2a8e6d1',
    refs: [],
    stack: [],
    en: {
      when: 'Oct 2022 → Aug 2024',
      scope: 'feat(tarahimo):',
      title: 'co-found a branding startup',
      role: 'Co-founder',
      text: 'A branding startup. I looked after the website and the order flows for private and business customers.',
      diff: ['+ website and order forms for B2C and B2B']
    },
    de: {
      when: 'Okt 2022 → Aug 2024',
      scope: 'feat(tarahimo):',
      title: 'Branding-Startup mitgründen',
      role: 'Mitgründer',
      text: 'Ein Branding-Startup. Ich habe mich um die Website und die Bestellprozesse für Privat- und Geschäftskunden gekümmert.',
      diff: ['+ Website und Bestellformulare für B2C und B2B']
    }
  },
  {
    hash: '0c0ffee',
    refs: [['tag', 'root']],
    stack: [],
    en: {
      when: 'before 2022',
      scope: 'chore:',
      title: "init, master's degree in architecture",
      role: 'Architecture',
      text: 'Floor plans, models and a lot of 3D software. That is where I first wanted to build the tools instead of just using them.',
      diff: []
    },
    de: {
      when: 'vor 2022',
      scope: 'chore:',
      title: 'init, Master in Architektur',
      role: 'Architektur',
      text: 'Grundrisse, Modelle und viel 3D-Software. Dort wollte ich zum ersten Mal die Werkzeuge bauen, statt sie nur zu benutzen.',
      diff: []
    }
  }
]
