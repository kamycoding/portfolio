import type { PortfolioProject, ProjectSlug } from './projects.model';

const IMPLEMENTATION_DETAILS =
  'Short text that describes your role or the workflow for this specific project. Let a recruiter know more about your knowledge and ability to work independently or collaboratively in a structured way.';

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
    description:
      'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
    imageSrc: '/assets/projects/join-laptop.webp',
    imageAlt: 'Join task manager displayed on a laptop',
    implementationDetails: IMPLEMENTATION_DETAILS,
    duration: '5 weeks',
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
    description:
      'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.',
    imageSrc: '/assets/projects/el-pollo-loco.webp',
    imageAlt: 'El Pollo Loco desert game scene with Pepe',
    implementationDetails: IMPLEMENTATION_DETAILS,
    duration: '3 weeks',
    technologies: [TECHNOLOGIES.javascript, TECHNOLOGIES.html, TECHNOLOGIES.css],
    variant: 'standard',
  },
  {
    slug: 'dabubble',
    title: 'DABubble',
    description:
      'This app is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
    imageSrc: '/assets/projects/dabubble.webp',
    imageAlt: 'DABubble team messaging interface',
    implementationDetails: IMPLEMENTATION_DETAILS,
    duration: '4 weeks',
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
