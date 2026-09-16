export type ProjectSlug =
  'heldio' | 'join' | 'sogand-personal-website' | 'el-pollo-loco' | 'dabubble';

export interface ProjectTechnology {
  readonly label: string;
  readonly icon: string;
}

interface BaseProject {
  readonly slug: ProjectSlug;
  readonly title: string;
  readonly descriptionKey: string;
  readonly imageSrc: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly imageAltKey: string;
  readonly implementationDetailsKey: string;
  readonly durationKey: string;
  readonly technologies: readonly ProjectTechnology[];
  readonly technologiesLabelKey?: string;
  readonly githubUrl?: string;
  readonly liveUrl?: string;
  readonly showOnHomepage: boolean;
}

export interface FeaturedProject extends BaseProject {
  readonly variant: 'featured';
}

export interface StandardProject extends BaseProject {
  readonly variant: 'standard';
}

export type PortfolioProject = FeaturedProject | StandardProject;
