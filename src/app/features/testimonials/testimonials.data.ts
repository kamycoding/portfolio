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
    quote:
      "Karl really kept the team together with his great organization and clear communication. We wouldn't have got this far without his commitment.",
    name: 'Tobias Lange',
    role: 'Frontend Developer',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-01',
  },
  {
    id: 'maria-schaefer',
    quote:
      'It was a great pleasure to work with Karl. He knows how to push and encourage team members to present the best work possible, always adding something to brainstorm. Regarding the well-being of group members, he was always present and available to listen and help others, with a great sense of humor as well.',
    name: 'Maria Schäfer',
    role: 'Frontend Developer',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-02',
  },
  {
    id: 'david-braun',
    quote:
      'Karl was a top team colleague at DA. His positive commitment and willingness to take on responsibility made a significant contribution to us achieving our goals.',
    name: 'David Braun',
    role: 'Frontend Developer',
    linkedinUrl: 'https://www.linkedin.com/',
    paperVariant: 'paper-01',
  },
] as const satisfies readonly Testimonial[];
