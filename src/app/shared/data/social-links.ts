export interface SocialLink {
  readonly id: 'github' | 'linkedin' | 'email';
  readonly labelKey: string;
  readonly href: string;
  readonly accessibleLabelKey: string;
  readonly iconSrc: string;
  readonly opensInNewTab: boolean;
}

const SOCIAL_LINKS = {
  github: {
    id: 'github',
    labelKey: 'social.githubLabel',
    href: 'https://github.com/kamycoding',
    accessibleLabelKey: 'social.githubAria',
    iconSrc: '/assets/icons/social/github.svg',
    opensInNewTab: true,
  },
  linkedin: {
    id: 'linkedin',
    labelKey: 'social.linkedinLabel',
    href: 'https://www.linkedin.com/in/kamyarzamanfar/',
    accessibleLabelKey: 'social.linkedinAria',
    iconSrc: '/assets/icons/social/linkedin.svg',
    opensInNewTab: true,
  },
  email: {
    id: 'email',
    labelKey: 'social.emailLabel',
    href: 'mailto:kamyar.zamanfar@gmail.com',
    accessibleLabelKey: 'social.emailAria',
    iconSrc: '/assets/icons/social/email.svg',
    opensInNewTab: false,
  },
} as const satisfies Record<SocialLink['id'], SocialLink>;

export const HEADER_SOCIAL_LINKS: readonly SocialLink[] = [
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.email,
];

export const FOOTER_SOCIAL_LINKS: readonly SocialLink[] = [
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.email,
];
