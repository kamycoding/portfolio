import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LegalPageLayout } from '../../shared/legal-page-layout/legal-page-layout';

@Component({
  selector: 'app-privacy-policy',
  imports: [LegalPageLayout, TranslatePipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {}
