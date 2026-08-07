import { Component } from '@angular/core';

import {
  TESTIMONIAL_PAPER_ASSETS,
  TESTIMONIALS,
} from '../../../../features/testimonials/testimonials.data';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  protected readonly paperAssets = TESTIMONIAL_PAPER_ASSETS;
  protected readonly testimonials = TESTIMONIALS;
}
