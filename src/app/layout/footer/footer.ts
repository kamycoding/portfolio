import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { FOOTER_SOCIAL_LINKS } from '../../shared/data/social-links';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly theme = input<'dark' | 'light'>('dark');

  protected readonly currentYear = new Date().getFullYear();
  protected readonly socialLinks = FOOTER_SOCIAL_LINKS;
}
