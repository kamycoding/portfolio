import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { HOMEPAGE_PROJECTS } from '../../../../features/projects/projects.data';
import { CtaLink } from '../../../../shared/ui/cta-link/cta-link';

@Component({
  selector: 'app-projects',
  imports: [CtaLink, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly projects = HOMEPAGE_PROJECTS;
}
