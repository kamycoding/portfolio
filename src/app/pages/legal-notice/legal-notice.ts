import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LegalPageLayout } from '../../shared/legal-page-layout/legal-page-layout';

@Component({
  selector: 'app-legal-notice',
  imports: [LegalPageLayout],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice {}
