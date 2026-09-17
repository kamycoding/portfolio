export interface AvailabilityCard {
  readonly id: 'cologne' | 'relocation' | 'remote';
  readonly labelKey: string;
  readonly iconSrc: string;
  readonly paperSrc: string;
  readonly variant: 'yellow' | 'blue' | 'orange';
}

export interface AboutParagraph {
  readonly id: 'introduction' | 'origin' | 'academic' | 'focus' | 'personal';
  readonly key: string;
}
