import { Component, HostListener, OnDestroy, signal, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { NavigationItem, SocialLink } from './header.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnDestroy {
  protected readonly activeLanguage = signal<'en' | 'de'>('en');
  protected readonly isMobileMenuOpen = signal(false);
  private readonly openMenuButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('openMenuButton');
  private readonly closeMenuButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeMenuButton');

  protected readonly navigationItems: readonly NavigationItem[] = [
    {
      label: 'About me',
      fragment: 'about',
      hoverDecorationSrc: '/assets/decorations/navigation/nav-hover-about.svg',
    },
    {
      label: 'Skills',
      fragment: 'skills',
      hoverDecorationSrc: '/assets/decorations/navigation/nav-hover-skills.svg',
    },
    {
      label: 'Projects',
      fragment: 'projects',
      hoverDecorationSrc: '/assets/decorations/navigation/nav-hover-projects.svg',
    },
    {
      label: 'Contact',
      fragment: 'contact',
      hoverDecorationSrc: '/assets/decorations/navigation/nav-hover-contact.svg',
    },
  ];

  protected readonly socialLinks: readonly SocialLink[] = [
    {
      id: 'linkedin',
      href: 'https://www.linkedin.com/in/kamyarzamanfar/',
      accessibleLabel: 'Visit LinkedIn profile',
      iconSrc: '/assets/icons/social/linkedin.svg',
      opensInNewTab: true,
    },
    {
      id: 'github',
      href: 'https://github.com/kamycoding',
      accessibleLabel: 'Visit GitHub profile',
      iconSrc: '/assets/icons/social/github.svg',
      opensInNewTab: true,
    },

    {
      id: 'email',
      href: 'mailto:kamyar.zamanfar@gmail.com',
      accessibleLabel: 'Send an email',
      iconSrc: '/assets/icons/social/email.svg',
      opensInNewTab: false,
    },
  ];

  protected toggleLanguage(): void {
    this.activeLanguage.update((language) => (language === 'en' ? 'de' : 'en'));
  }

  protected openMobileMenu(): void {
    this.isMobileMenuOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
