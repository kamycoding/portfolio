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

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'sogand-asari',
    quoteKey: 'testimonials.items.sogandAsari.quote',
    name: 'Sogand Asari',
    roleKey: 'testimonials.items.sogandAsari.role',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-01',
  },
  {
    id: 'max-belich',
    quoteKey: 'testimonials.items.maxBelich.quote',
    name: 'Max Belich',
    roleKey: 'testimonials.items.maxBelich.role',
    linkedinUrl: 'https://www.linkedin.com/in/max-belich-6b844b424/',
    paperVariant: 'paper-02',
  },
  {
    id: 'tobias-illner',
    quoteKey: 'testimonials.items.tobiasIllner.quote',
    name: 'Tobias Illner',
    roleKey: 'testimonials.items.tobiasIllner.role',
    linkedinUrl: 'https://www.linkedin.com/in/tobias-illner/',
    paperVariant: 'paper-01',
  },
];
