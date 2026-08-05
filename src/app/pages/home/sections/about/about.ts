import { Component } from '@angular/core';

import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';
import type { AvailabilityCard } from './about.model';

@Component({
  selector: 'app-about',
  imports: [CtaLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly availabilityCards: readonly AvailabilityCard[] = [
    {
      id: 'cologne',
      label: 'Based in Köln',
      iconSrc: '/assets/about/location.svg',
      paperSrc: '/assets/about/availability-yellow-paper.svg',
      variant: 'yellow',
    },
    {
      id: 'relocation',
      label: 'Open to relocation',
      iconSrc: '/assets/about/relocation.svg',
      paperSrc: '/assets/about/availability-blue-paper.svg',
      variant: 'blue',
    },
    {
      id: 'remote',
      label: 'Open to work remote',
      iconSrc: '/assets/about/remote.svg',
      paperSrc: '/assets/about/availability-orange-paper.svg',
      variant: 'orange',
    },
  ];
}
