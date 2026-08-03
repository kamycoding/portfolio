import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  HostListener,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { NavigationItem, SocialLink } from './header.model';

const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private readonly openMenuButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('openMenuButton');

  private readonly closeMenuButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeMenuButton');

  private previousBodyOverflow = '';
  private isBodyScrollLocked = false;

  protected readonly activeLanguage = signal<'en' | 'de'>('en');
  protected readonly isMobileMenuOpen = signal(false);

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
    if (this.isMobileMenuOpen()) {
      return;
    }

    this.isMobileMenuOpen.set(true);
    this.lockBodyScroll();

    afterNextRender(
      () => {
        if (this.isMobileMenuOpen()) {
          this.closeMenuButton().nativeElement.focus({
            preventScroll: true,
          });
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  protected closeMobileMenu(restoreFocus = true): void {
    if (!this.isMobileMenuOpen()) {
      return;
    }

    if (restoreFocus) {
      this.openMenuButton().nativeElement.focus({
        preventScroll: true,
      });
    }

    this.isMobileMenuOpen.set(false);
    this.restoreBodyScroll();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (!this.isMobileMenuOpen()) {
      return;
    }

    this.closeMobileMenu();
  }

  @HostListener('window:resize')
  protected onViewportResize(): void {
    const isDesktop = this.document.defaultView?.matchMedia(DESKTOP_MEDIA_QUERY).matches ?? false;

    if (isDesktop) {
      this.closeMobileMenu(false);
    }
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  private lockBodyScroll(): void {
    if (this.isBodyScrollLocked) {
      return;
    }

    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    this.isBodyScrollLocked = true;
  }

  private restoreBodyScroll(): void {
    if (!this.isBodyScrollLocked) {
      return;
    }

    this.document.body.style.overflow = this.previousBodyOverflow;
    this.isBodyScrollLocked = false;
  }
}
