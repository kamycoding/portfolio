import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Footer, TranslatePipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
