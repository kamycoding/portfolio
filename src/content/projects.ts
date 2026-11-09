// Project data from the approved prototype (docs/design/prototype/app.js). Durations and years confirmed by Kamyar.
export type ProjectCopy = Readonly<{
  title: string
  tag: string
  desc: string
  role: string
  time: string
  context: string
  status: string
  notes: readonly [readonly [string, string], readonly [string, string]]
}>

export type Project = Readonly<{
  id: string
  art: 'heldio' | 'join' | 'designer' | 'pollo'

  // Accent token for the row marker, status dot and cover glow.
  accent: 'kw' | 'prop' | 'str' | 'num'
  year: string
  url: string
  size: string
  stack: readonly string[]
  links: ReadonlyArray<readonly ['live' | 'code', string]>
  en: ProjectCopy
  de: ProjectCopy
}>

export const PROJECTS: readonly Project[] = [
  {
    id: 'heldio',
    art: 'heldio',
    accent: 'kw',
    year: '2026',
    url: 'heldio.app',
    size: '1440 × 900',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NestJS', 'PostgreSQL'],
    links: [['live', 'https://heldio.app/']],
    en: {
      title: 'Heldio',
      tag: 'Language learning that starts from your real goal.',
      desc: 'An AI-powered platform for contextual language learning. It turns real goals and personal context into a tailored path with practice, feedback and visible progress.',
      role: 'Co-founder, frontend',
      time: 'since 2026',
      context: 'own startup',
      status: 'in development',
      notes: [
        [
          'problem',
          'Most language courses teach the same path to everyone, whatever the learner actually needs the language for.'
        ],
        [
          'my part',
          'I lead the product concept, MVP scope and roadmap, and work on the architecture and the frontend of the web platform.'
        ]
      ]
    },
    de: {
      title: 'Heldio',
      tag: 'Sprachenlernen, das bei deinem echten Ziel beginnt.',
      desc: 'Eine KI-Plattform für kontextbezogenes Sprachenlernen. Sie macht aus echten Zielen und persönlichem Kontext einen Lernweg mit Übung, Feedback und sichtbarem Fortschritt.',
      role: 'Mitgründer, Frontend',
      time: 'seit 2026',
      context: 'eigenes Startup',
      status: 'in Entwicklung',
      notes: [
        [
          'problem',
          'Die meisten Sprachkurse lehren allen denselben Weg, egal wofür jemand die Sprache wirklich braucht.'
        ],
        [
          'mein teil',
          'Ich verantworte Produktkonzept, MVP-Umfang und Roadmap und arbeite an der Architektur und am Frontend der Web-Plattform.'
        ]
      ]
    }
  },
  {
    id: 'join',
    art: 'join',
    accent: 'prop',
    year: '2026',
    url: 'join.kamycoding.com',
    size: '1440 × 740',
    stack: ['Angular', 'TypeScript', 'SCSS', 'Supabase', 'RxJS'],
    links: [
      ['live', 'https://join.kamycoding.com'],
      ['code', 'https://github.com/kamycoding/join-kanban']
    ],
    en: {
      title: 'Join',
      tag: 'A Kanban board for teams.',
      desc: 'A responsive Kanban app with drag and drop, user accounts, guest access and contact management, built as a team.',
      role: 'Frontend developer',
      time: '5 weeks',
      context: 'team project',
      status: 'live',
      notes: [
        [
          'problem',
          'A team needs one place to plan tasks and move them through stages without losing track of who does what.'
        ],
        [
          'my part',
          'I owned contact management: creating, editing, deleting and grouping contacts, the detail views and the validation logic.'
        ]
      ]
    },
    de: {
      title: 'Join',
      tag: 'Ein Kanban-Board für Teams.',
      desc: 'Eine responsive Kanban-App mit Drag and Drop, Benutzerkonten, Gastzugang und Kontaktverwaltung, im Team gebaut.',
      role: 'Frontend-Entwickler',
      time: '5 Wochen',
      context: 'Teamprojekt',
      status: 'live',
      notes: [
        [
          'problem',
          'Ein Team braucht einen Ort, an dem es Aufgaben plant und durch Phasen bewegt, ohne den Überblick zu verlieren, wer was macht.'
        ],
        [
          'mein teil',
          'Ich war für die Kontaktverwaltung zuständig: Kontakte anlegen, bearbeiten, löschen und gruppieren, die Detailansichten und die Validierung.'
        ]
      ]
    }
  },
  {
    id: 'designer-portfolio',
    art: 'designer',
    accent: 'str',
    year: '2026',
    url: 'sogandasari.com',
    size: '1440 × 840',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    links: [['live', 'https://www.sogandasari.com/']],
    en: {
      title: 'Designer portfolio',
      tag: 'A portfolio for a UX/UI and product designer.',
      desc: 'A personal portfolio that presents projects, design process and product thinking through a clear, modern and visual experience.',
      role: 'Frontend developer',
      time: '4 months',
      context: 'client project',
      status: 'live',
      notes: [
        ['goal', 'Design work should be easy to explore without losing its personality.'],
        [
          'what I built',
          'Clear hierarchy, responsive layouts, smooth navigation and purposeful animation with Framer Motion.'
        ]
      ]
    },
    de: {
      title: 'Designer-Portfolio',
      tag: 'Ein Portfolio für eine UX/UI- und Produktdesignerin.',
      desc: 'Ein persönliches Portfolio, das Projekte, Designprozess und Produktdenken klar, modern und visuell zeigt.',
      role: 'Frontend-Entwickler',
      time: '4 Monate',
      context: 'Kundenprojekt',
      status: 'live',
      notes: [
        ['ziel', 'Designarbeit soll leicht zu entdecken sein, ohne ihre Persönlichkeit zu verlieren.'],
        [
          'was ich gebaut habe',
          'Klare Hierarchie, responsive Layouts, flüssige Navigation und gezielte Animationen mit Framer Motion.'
        ]
      ]
    }
  },
  {
    id: 'el-pollo-loco',
    art: 'pollo',
    accent: 'num',
    year: '2026',
    url: 'elpolloloco.kamycoding.com',
    size: '720 × 480',
    stack: ['JavaScript', 'HTML', 'CSS'],
    links: [
      ['live', 'https://elpolloloco.kamycoding.com'],
      ['code', 'https://github.com/kamycoding/El-Pollo-Loco']
    ],
    en: {
      title: 'El Pollo Loco',
      tag: 'A jump-and-run browser game.',
      desc: 'Guide Pepe through a desert world, collect coins and Tabasco bottles, and face enemies along the way.',
      role: 'Developer',
      time: '3 weeks',
      context: 'solo project',
      status: 'playable',
      notes: [
        [
          'how it works',
          'Characters, enemies and game objects are reusable classes. Movement, animation and collisions run in the browser.'
        ],
        [
          'what I learned',
          'Object-oriented JavaScript, a game loop and keeping state predictable when a lot happens every frame.'
        ]
      ]
    },
    de: {
      title: 'El Pollo Loco',
      tag: 'Ein Jump-and-Run-Spiel im Browser.',
      desc: 'Führe Pepe durch eine Wüstenwelt, sammle Münzen und Tabasco-Flaschen und stell dich den Gegnern.',
      role: 'Entwickler',
      time: '3 Wochen',
      context: 'Soloprojekt',
      status: 'spielbar',
      notes: [
        [
          "so funktioniert's",
          'Figuren, Gegner und Spielobjekte sind wiederverwendbare Klassen. Bewegung, Animation und Kollisionen laufen im Browser.'
        ],
        [
          'was ich gelernt habe',
          'Objektorientiertes JavaScript, eine Game-Loop und vorhersehbarer State, wenn in jedem Frame viel passiert.'
        ]
      ]
    }
  }
]
