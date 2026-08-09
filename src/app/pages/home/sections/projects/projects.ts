import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PORTFOLIO_PROJECTS } from '../../../../features/projects/projects.data';
import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';

@Component({
  selector: 'app-projects',
  imports: [CtaLink, TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly projects = PORTFOLIO_PROJECTS;
}
