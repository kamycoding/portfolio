import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink, Footer],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {}
