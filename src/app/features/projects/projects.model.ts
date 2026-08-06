export type ProjectSlug = 'join' | 'el-pollo-loco' | 'dabubble';

interface BaseProject {
  readonly slug: ProjectSlug;
  readonly title: string;
  readonly description: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export interface FeaturedProject extends BaseProject {
  readonly variant: 'featured';
  readonly badgeSrc: string;
}

export interface StandardProject extends BaseProject {
  readonly variant: 'standard';
}

export type PortfolioProject = FeaturedProject | StandardProject;
