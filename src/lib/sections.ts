// Single source for the page sections: tabs, breadcrumbs, status bar and footer all read this list.
export const SECTIONS = [
  { id: 'index', file: 'index.tsx', dot: 'bg-kw', crumb: null },
  { id: 'work', file: 'work.tsx', dot: 'bg-str', crumb: ['src', 'app'] },
  { id: 'about', file: 'about.md', dot: 'bg-prop', crumb: ['docs'] },
  { id: 'stack', file: 'stack.json', dot: 'bg-num', crumb: ['config'] },
  { id: 'contact', file: 'contact.ts', dot: 'bg-muted', crumb: ['src', 'api'] }
] as const

export type Section = (typeof SECTIONS)[number]

export type SectionId = Section['id']

// Sections below the hero, each with a breadcrumb and a meta text.
export type FileSectionId = Exclude<SectionId, 'index'>

export const getSection = (id: SectionId) => SECTIONS.find(section => section.id === id)!

// Pages outside the one-page sections. They open as their own file tab.
export const PAGES = [
  { href: '/legal-notice', file: 'legal-notice.md', crumb: ['legal'] },
  { href: '/privacy-policy', file: 'privacy-policy.md', crumb: ['legal'] }
] as const

export type Page = (typeof PAGES)[number]

export const getPage = (pathname: string) => PAGES.find(page => page.href === pathname)
