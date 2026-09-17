import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';
import type { AboutParagraph, AvailabilityCard } from './about.model';

@Component({
  selector: 'app-about',
  imports: [CtaLink, TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly isBiographyExpanded = signal(false);

  /** Always visible; the remaining paragraphs sit behind the read-more toggle. */
  protected readonly leadParagraphs: readonly AboutParagraph[] = [
    { id: 'introduction', key: 'about.paragraphs.introduction' },
    { id: 'origin', key: 'about.paragraphs.origin' },
  ];

  protected readonly additionalParagraphs: readonly AboutParagraph[] = [
    { id: 'academic', key: 'about.paragraphs.academic' },
    { id: 'focus', key: 'about.paragraphs.focus' },
    { id: 'personal', key: 'about.paragraphs.personal' },
  ];

  protected toggleBiography(): void {
    this.isBiographyExpanded.update((expanded) => !expanded);
  }

  protected readonly availabilityCards: readonly AvailabilityCard[] = [
    {
      id: 'cologne',
      labelKey: 'about.availability.cologne',
      iconSrc: '/assets/about/location.svg',
      paperSrc: '/assets/about/availability-yellow-paper.svg',
      variant: 'yellow',
    },
    {
      id: 'relocation',
      labelKey: 'about.availability.relocation',
      iconSrc: '/assets/about/relocation.svg',
      paperSrc: '/assets/about/availability-blue-paper.svg',
      variant: 'blue',
    },
    {
      id: 'remote',
      labelKey: 'about.availability.remote',
      iconSrc: '/assets/about/remote.svg',
      paperSrc: '/assets/about/availability-orange-paper.svg',
      variant: 'orange',
    },
  ];
}
