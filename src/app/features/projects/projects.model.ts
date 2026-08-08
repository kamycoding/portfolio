export type ProjectSlug = 'join' | 'el-pollo-loco' | 'dabubble';

export interface ProjectTechnology {
  readonly label: string;
  readonly iconSrc?: string;
}

interface BaseProject {
  readonly slug: ProjectSlug;
  readonly title: string;
  readonly description: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly implementationDetails: string;
  readonly duration: string;
  readonly technologies: readonly ProjectTechnology[];
  readonly githubUrl?: string;
  readonly liveUrl?: string;
}

export interface FeaturedProject extends BaseProject {
  readonly variant: 'featured';
  readonly badgeSrc: string;
}

export interface StandardProject extends BaseProject {
  readonly variant: 'standard';
}

export type PortfolioProject = FeaturedProject | StandardProject;
