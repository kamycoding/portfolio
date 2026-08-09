import type {
  Testimonial,
  TestimonialPaperAssets,
  TestimonialPaperVariant,
} from './testimonials.model';

export const TESTIMONIAL_PAPER_ASSETS = {
  'paper-01': {
    desktopSrc: '/assets/testimonials/testimonial-paper-01-desktop.webp',
    mobileSrc: '/assets/testimonials/testimonial-paper-02-mobile.webp',
  },
  'paper-02': {
    desktopSrc: '/assets/testimonials/testimonial-paper-02-desktop.webp',
    mobileSrc: '/assets/testimonials/testimonial-paper-02-mobile.webp',
  },
} as const satisfies Readonly<Record<TestimonialPaperVariant, TestimonialPaperAssets>>;

export const TESTIMONIALS = [
  {
    id: 'tobias-lange',
    quoteKey: 'testimonials.items.tobiasLange.quote',
    name: 'Tobias Lange',
    roleKey: 'testimonials.items.tobiasLange.role',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-01',
  },
  {
    id: 'maria-schaefer',
    quoteKey: 'testimonials.items.mariaSchaefer.quote',
    name: 'Maria Schäfer',
    roleKey: 'testimonials.items.mariaSchaefer.role',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-02',
  },
  {
    id: 'david-braun',
    quoteKey: 'testimonials.items.davidBraun.quote',
    name: 'David Braun',
    roleKey: 'testimonials.items.davidBraun.role',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-01',
  },
] as const satisfies readonly Testimonial[];
