import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Footer } from '../../../../layout/footer/footer';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-contact-footer-surface',
  imports: [Contact, Footer],
  templateUrl: './contact-footer-surface.html',
  styleUrl: './contact-footer-surface.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFooterSurface {}
