import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Footer],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
