import type { PortfolioProject } from './projects.model';

export const PORTFOLIO_PROJECTS = [
  {
    slug: 'join',
    title: 'Join',
    description:
      'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
    imageSrc: '/assets/projects/join-laptop.webp',
    imageAlt: 'Join task manager displayed on a laptop',
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
    variant: 'standard',
  },
  {
    slug: 'dabubble',
    title: 'DABubble',
    description:
      'This app is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.',
    imageSrc: '/assets/projects/dabubble.webp',
    imageAlt: 'DABubble team messaging interface',
    variant: 'standard',
  },
] as const satisfies readonly PortfolioProject[];
