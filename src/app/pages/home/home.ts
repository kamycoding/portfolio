import { Component } from '@angular/core';

import { Hero } from './sections/hero/hero';
import { About } from './sections/about/about';

@Component({
  selector: 'app-home',
  imports: [Hero, About],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
