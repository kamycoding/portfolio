import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';
import type { AvailabilityCard } from './about.model';

@Component({
  selector: 'app-about',
  imports: [CtaLink, TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
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
