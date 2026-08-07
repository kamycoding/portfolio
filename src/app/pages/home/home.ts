import { Component } from '@angular/core';

import { About } from './sections/about/about';
import { Hero } from './sections/hero/hero';
import { Projects } from './sections/projects/projects';
import { Skills } from './sections/skills/skills';
import { Testimonials } from './sections/testimonials/testimonials';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Projects, Testimonials],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
