export interface SocialLink {
  readonly id: 'github' | 'linkedin' | 'email';
  readonly label: string;
  readonly href: string;
  readonly accessibleLabel: string;
  readonly iconSrc: string;
  readonly opensInNewTab: boolean;
}

const SOCIAL_LINKS = {
  github: {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/kamycoding',
    accessibleLabel: 'Visit GitHub profile',
    iconSrc: '/assets/icons/social/github.svg',
    opensInNewTab: true,
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kamyarzamanfar/',
    accessibleLabel: 'Visit LinkedIn profile',
    iconSrc: '/assets/icons/social/linkedin.svg',
    opensInNewTab: true,
  },
  email: {
    id: 'email',
    label: 'Email',
    href: 'mailto:kamyar.zamanfar@gmail.com',
    accessibleLabel: 'Send an email',
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
