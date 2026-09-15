import type { PortfolioProject, ProjectSlug } from './projects.model';

const TECHNOLOGIES = {
  angular: { label: 'Angular', iconSrc: '/assets/skills/icons/Angular.svg' },
  css: { label: 'CSS', iconSrc: '/assets/skills/icons/CSS.svg' },
  firebase: { label: 'Firebase', iconSrc: '/assets/skills/icons/Firebase.svg' },
  html: { label: 'HTML', iconSrc: '/assets/skills/icons/HTML.svg' },
  javascript: { label: 'JavaScript', iconSrc: '/assets/skills/icons/Js.svg' },
  typescript: { label: 'TypeScript', iconSrc: '/assets/skills/icons/Ts.svg' },
} as const;

export const PORTFOLIO_PROJECTS = [
  {
    slug: 'join',
    title: 'Join',
    descriptionKey: 'projects.items.join.description',
    imageSrc: '/assets/projects/join-laptop.webp',
    imageAltKey: 'projects.items.join.imageAlt',
    implementationDetailsKey: 'projects.items.join.implementation',
    durationKey: 'projects.items.join.duration',
    technologies: [
      TECHNOLOGIES.css,
      TECHNOLOGIES.html,
      TECHNOLOGIES.firebase,
      TECHNOLOGIES.angular,
      TECHNOLOGIES.typescript,
    ],
    variant: 'featured',
    badgeSrc: '/assets/projects/featured-project-badge.webp',
  },
  {
    slug: 'el-pollo-loco',
    title: 'El Pollo Loco',
    descriptionKey: 'projects.items.elPolloLoco.description',
    imageSrc: '/assets/projects/el-pollo-loco.webp',
    imageAltKey: 'projects.items.elPolloLoco.imageAlt',
    implementationDetailsKey: 'projects.items.elPolloLoco.implementation',
    durationKey: 'projects.items.elPolloLoco.duration',
    technologies: [TECHNOLOGIES.javascript, TECHNOLOGIES.html, TECHNOLOGIES.css],
    githubUrl: 'https://github.com/kamycoding/El-Pollo-Loco',
    liveUrl: 'https://elpolloloco.kamycoding.com',
    variant: 'standard',
  },
  {
    slug: 'dabubble',
    title: 'DABubble',
    descriptionKey: 'projects.items.dabubble.description',
    imageSrc: '/assets/projects/dabubble.webp',
    imageAltKey: 'projects.items.dabubble.imageAlt',
    implementationDetailsKey: 'projects.items.dabubble.implementation',
    durationKey: 'projects.items.dabubble.duration',
    technologies: [TECHNOLOGIES.javascript, TECHNOLOGIES.html, TECHNOLOGIES.css],
    variant: 'standard',
  },
] as const satisfies readonly PortfolioProject[];

export function getProjectBySlug(slug: string | null): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((project) => project.slug === slug);
}

export function getNextProject(slug: ProjectSlug): PortfolioProject {
  const currentIndex = PORTFOLIO_PROJECTS.findIndex((project) => project.slug === slug);
  const nextIndex = (currentIndex + 1) % PORTFOLIO_PROJECTS.length;

  return PORTFOLIO_PROJECTS[nextIndex];
}
