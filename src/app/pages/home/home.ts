import { Component } from '@angular/core';

import { About } from './sections/about/about';
import { Hero } from './sections/hero/hero';
import { Skills } from './sections/skills/skills';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
