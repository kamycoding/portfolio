import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-link',
  imports: [RouterLink],
  templateUrl: './cta-link.html',
  styleUrl: './cta-link.css',
})

//! note check again
export class CtaLink {
  readonly label = input.required<string>();
  readonly route = input('/');
  readonly fragment = input<string>();
  readonly surface = input<'dark' | 'light'>('dark');
}
