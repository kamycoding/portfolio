export type TestimonialId = 'tobias-lange' | 'maria-schaefer' | 'david-braun';

export type TestimonialPaperVariant = 'paper-01' | 'paper-02';

export interface Testimonial {
  readonly id: TestimonialId;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly linkedinUrl: string;
  readonly paperVariant: TestimonialPaperVariant;
}

export interface TestimonialPaperAssets {
  readonly desktopSrc: string;
  readonly mobileSrc: string;
}
