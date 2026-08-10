import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LegalPageLayout } from '../../shared/legal-page-layout/legal-page-layout';

@Component({
  selector: 'app-legal-notice',
  imports: [LegalPageLayout, TranslatePipe],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice {}
