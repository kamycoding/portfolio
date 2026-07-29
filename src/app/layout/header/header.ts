import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly activeLanguage = signal<'en' | 'de'>('en');
  protected toggleLanguage(): void {
    this.activeLanguage.update((language) => (language === 'en' ? 'de' : 'en'));
  }
}
