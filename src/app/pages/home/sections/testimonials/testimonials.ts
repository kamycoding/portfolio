import { Component, HostListener, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  TESTIMONIAL_PAPER_ASSETS,
  TESTIMONIALS,
} from '../../../../features/testimonials/testimonials.data';
import type { TestimonialId } from '../../../../features/testimonials/testimonials.model';

@Component({
  selector: 'app-testimonials',
  imports: [TranslatePipe],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  protected readonly paperAssets = TESTIMONIAL_PAPER_ASSETS;
  protected readonly testimonials = TESTIMONIALS;
  protected readonly activeTestimonialId = signal<TestimonialId | null>(null);

  protected activateTestimonial(event: Event, testimonialId: TestimonialId): void {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    event.stopPropagation();
    this.activeTestimonialId.set(testimonialId);
  }

  @HostListener('document:click', ['$event'])
  protected clearActiveTestimonial(event: MouseEvent): void {
    this.activeTestimonialId.set(null);

    const activeElement = (event.currentTarget as Document).activeElement;

    if (activeElement instanceof HTMLElement && activeElement.closest('.testimonial-card')) {
      activeElement.blur();
    }
  }
}
