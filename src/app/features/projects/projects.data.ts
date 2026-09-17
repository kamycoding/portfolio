import type { PortfolioProject, ProjectSlug } from './projects.model';

const TECHNOLOGIES = {
  angular: { label: 'Angular', icon: 'devicon:angular' },
  angularCdk: { label: 'Angular CDK', icon: 'devicon:angular' },
  css: { label: 'CSS', icon: 'devicon:css3' },
  framerMotion: { label: 'Framer Motion', icon: 'logos:framer' },
  html: { label: 'HTML', icon: 'devicon:html5' },
  javascript: { label: 'JavaScript', icon: 'devicon:javascript' },
  nestJs: { label: 'NestJS', icon: 'devicon:nestjs' },
  nextJs: { label: 'Next.js', icon: 'devicon:nextjs' },
  postgresql: { label: 'PostgreSQL', icon: 'devicon:postgresql' },
  react: { label: 'React', icon: 'devicon:react' },
  rxjs: { label: 'RxJS', icon: 'devicon:rxjs' },
  scss: { label: 'SCSS', icon: 'devicon:sass' },
  supabase: { label: 'Supabase', icon: 'devicon:supabase' },
  tailwindCss: { label: 'Tailwind CSS', icon: 'devicon:tailwindcss' },
  typescript: { label: 'TypeScript', icon: 'devicon:typescript' },
} as const;

export const PORTFOLIO_PROJECTS = [
  {
    slug: 'heldio',
    title: 'Heldio',
    descriptionKey: 'projects.items.heldio.description',
    imageSrc: '/assets/projects/heldio-showcase.webp',
    imageWidth: 1536,
    imageHeight: 1024,
    imageAltKey: 'projects.items.heldio.imageAlt',
    implementationDetailsKey: 'projects.items.heldio.implementation',
    durationKey: 'projects.items.heldio.duration',
    technologies: [
      TECHNOLOGIES.nextJs,
      TECHNOLOGIES.react,
      TECHNOLOGIES.typescript,
      TECHNOLOGIES.tailwindCss,
      TECHNOLOGIES.nestJs,
      TECHNOLOGIES.postgresql,
    ],
    technologiesLabelKey: 'projects.plannedStack',
    liveUrl: 'https://heldio.app/',
    variant: 'featured',
    showOnHomepage: true,
  },
  {
    slug: 'join',
    title: 'Join',
    descriptionKey: 'projects.items.join.description',
    imageSrc: '/assets/projects/join-showcase.webp',
    imageWidth: 1448,
    imageHeight: 1086,
    imageAltKey: 'projects.items.join.imageAlt',
    implementationDetailsKey: 'projects.items.join.implementation',
    durationKey: 'projects.items.join.duration',
    technologies: [
      TECHNOLOGIES.angular,
      TECHNOLOGIES.typescript,
      TECHNOLOGIES.scss,
      TECHNOLOGIES.supabase,
      TECHNOLOGIES.postgresql,
      TECHNOLOGIES.rxjs,
      TECHNOLOGIES.angularCdk,
    ],
    githubUrl: 'https://github.com/kamycoding/join-kanban',
    liveUrl: 'https://join.kamycoding.com',
    variant: 'standard',
    showOnHomepage: true,
  },
  {
    slug: 'sogand-personal-website',
    title: 'Portfolio Website',
    descriptionKey: 'projects.items.sogand.description',
    imageSrc: '/assets/projects/sogand-showcase.webp',
    imageWidth: 1448,
    imageHeight: 1086,
    imageAltKey: 'projects.items.sogand.imageAlt',
    implementationDetailsKey: 'projects.items.sogand.implementation',
    durationKey: 'projects.items.sogand.duration',
    technologies: [
      TECHNOLOGIES.nextJs,
      TECHNOLOGIES.react,
      TECHNOLOGIES.typescript,
      TECHNOLOGIES.tailwindCss,
      TECHNOLOGIES.framerMotion,
    ],
    liveUrl: 'https://www.sogandasari.com/',
    variant: 'standard',
    showOnHomepage: true,
  },
  {
    slug: 'el-pollo-loco',
    title: 'El Pollo Loco',
    descriptionKey: 'projects.items.elPolloLoco.description',
    imageSrc: '/assets/projects/el-pollo-loco-showcase.webp',
    imageWidth: 1448,
    imageHeight: 1086,
    imageAltKey: 'projects.items.elPolloLoco.imageAlt',
    implementationDetailsKey: 'projects.items.elPolloLoco.implementation',
    durationKey: 'projects.items.elPolloLoco.duration',
    technologies: [TECHNOLOGIES.javascript, TECHNOLOGIES.html, TECHNOLOGIES.css],
    githubUrl: 'https://github.com/kamycoding/El-Pollo-Loco',
    liveUrl: 'https://elpolloloco.kamycoding.com',
    variant: 'standard',
    showOnHomepage: true,
  },
] as const satisfies readonly PortfolioProject[];

export const HOMEPAGE_PROJECTS: readonly PortfolioProject[] = PORTFOLIO_PROJECTS.filter(
  (project) => project.showOnHomepage,
);

export function getProjectBySlug(slug: string | null): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((project) => project.slug === slug);
}

export function getNextProject(slug: ProjectSlug): PortfolioProject {
  const currentIndex = PORTFOLIO_PROJECTS.findIndex((project) => project.slug === slug);
  const nextIndex = (currentIndex + 1) % PORTFOLIO_PROJECTS.length;

  return PORTFOLIO_PROJECTS[nextIndex];
}
