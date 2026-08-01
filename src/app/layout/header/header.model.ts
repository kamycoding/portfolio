export interface NavigationItem {
  readonly label: string;
  readonly fragment: string;
  readonly hoverDecorationSrc: string;
}

export interface SocialLink {
  readonly id: string;
  readonly href: string;
  readonly accessibleLabel: string;
  readonly iconSrc: string;
  readonly opensInNewTab: boolean;
}
