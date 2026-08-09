import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-legal-page-layout',
  imports: [RouterLink, Footer],
  templateUrl: './legal-page-layout.html',
  styleUrl: './legal-page-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageLayout {
  readonly title = input.required<string>();
}
