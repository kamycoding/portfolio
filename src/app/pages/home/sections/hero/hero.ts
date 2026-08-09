import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';

@Component({
  selector: 'app-hero',
  imports: [CtaLink, TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {}
