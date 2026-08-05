import { Component } from '@angular/core';

import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';

@Component({
  selector: 'app-hero',
  imports: [CtaLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {}
