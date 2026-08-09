export interface AvailabilityCard {
  readonly id: 'cologne' | 'relocation' | 'remote';
  readonly labelKey: string;
  readonly iconSrc: string;
  readonly paperSrc: string;
  readonly variant: 'yellow' | 'blue' | 'orange';
}
