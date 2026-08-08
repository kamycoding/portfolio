import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-legal-notice',
  imports: [RouterLink, Footer],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice {}
