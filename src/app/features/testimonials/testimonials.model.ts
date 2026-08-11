export type TestimonialId = 'tobias-lange' | 'sogand-asari' | 'david-braun';

export type TestimonialPaperVariant = 'paper-01' | 'paper-02';

export interface Testimonial {
  readonly id: TestimonialId;
  readonly quoteKey: string;
  readonly name: string;
  readonly roleKey: string;
  readonly linkedinUrl: string;
  readonly paperVariant: TestimonialPaperVariant;
}

export interface TestimonialPaperAssets {
  readonly desktopSrc: string;
  readonly mobileSrc: string;
}
