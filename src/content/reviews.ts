// Reviews as pull request approvals, from the approved prototype (docs/design/prototype/app.js REVIEWS).
export type Review = Readonly<{
  name: string
  linkedin: string
  initials: string
  accent: 'kw' | 'prop' | 'str'
  role: string
  context: 'teamProject' | 'clientProject'
  en: string
  de: string
}>

export const REVIEWS: readonly Review[] = [
  {
    name: 'Max Belich',
    linkedin: 'https://www.linkedin.com/in/max-belich-6b844b424/',
    initials: 'MB',
    accent: 'kw',
    role: 'Full Stack Developer',
    context: 'teamProject',
    en: 'Kamyar gave his all throughout the entire project. He invested a great deal of time and energy into moving the project forward, supporting his team, and helping whenever problems arose.',
    de: 'Kamyar hat während des gesamten Projekts alles gegeben. Er hat viel Zeit und Energie investiert, um das Projekt voranzubringen, sein Team zu unterstützen und bei Problemen zu helfen.'
  },
  {
    name: 'Tobias Illner',
    linkedin: 'https://www.linkedin.com/in/tobias-illner/',
    initials: 'TI',
    accent: 'prop',
    role: 'Full Stack Developer',
    context: 'teamProject',
    en: 'Kamyar always completed his tasks conscientiously and reliably. He actively offers his help and supports the team. Whenever something is unclear, he asks focused questions.',
    de: 'Kamyar hat seine Aufgaben immer gewissenhaft und zuverlässig erledigt. Er bietet aktiv Hilfe an und unterstützt das Team. Wenn etwas unklar ist, stellt er gezielte Fragen.'
  },
  {
    name: 'Sogand Asari',
    linkedin: 'https://www.linkedin.com/in/sogandasari/',
    initials: 'SA',
    accent: 'str',
    role: 'Product Designer',
    context: 'clientProject',
    en: 'Kamyar created my portfolio website and guided the entire process with great professionalism and care. He was patient, precise, and always focused on finding the right solution for my needs.',
    de: 'Kamyar hat meine Portfolio-Website gebaut und den ganzen Prozess mit viel Professionalität und Sorgfalt begleitet. Er war geduldig, präzise und hat immer die richtige Lösung für mich gesucht.'
  }
]
