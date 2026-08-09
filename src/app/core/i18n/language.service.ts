import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, computed, effect, inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export const SUPPORTED_LANGUAGES = ['en', 'de'] as const;
export const LANGUAGE_STORAGE_KEY = 'kamycoding.language';

export type ApplicationLanguage = (typeof SUPPORTED_LANGUAGES)[number];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly currentLanguage = computed<ApplicationLanguage>(() => {
    const language = this.translate.currentLang();

    return this.isSupportedLanguage(language) ? language : 'en';
  });

  constructor() {
    this.translate.addLangs([...SUPPORTED_LANGUAGES]);

    effect(() => {
      this.document.documentElement.lang = this.currentLanguage();
    });
  }

  async initialize(): Promise<void> {
    await firstValueFrom(this.translate.use(this.resolveInitialLanguage()));
  }

  async setLanguage(language: ApplicationLanguage): Promise<void> {
    await firstValueFrom(this.translate.use(language));
    this.persistLanguage(language);
  }

  async toggleLanguage(): Promise<void> {
    await this.setLanguage(this.currentLanguage() === 'en' ? 'de' : 'en');
  }

  private resolveInitialLanguage(): ApplicationLanguage {
    const storedLanguage = this.readStoredLanguage();

    if (storedLanguage) {
      return storedLanguage;
    }

    if (!this.isBrowser) {
      return 'en';
    }

    const browserLanguage = this.translate.getBrowserLang();

    return this.isSupportedLanguage(browserLanguage) ? browserLanguage : 'en';
  }

  private readStoredLanguage(): ApplicationLanguage | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const storedLanguage = this.document.defaultView?.localStorage.getItem(LANGUAGE_STORAGE_KEY);

      return this.isSupportedLanguage(storedLanguage) ? storedLanguage : null;
    } catch {
      return null;
    }
  }

  private persistLanguage(language: ApplicationLanguage): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      this.document.defaultView?.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language switching still works when storage is unavailable.
    }
  }

  private isSupportedLanguage(
    language: string | null | undefined,
  ): language is ApplicationLanguage {
    return language === 'en' || language === 'de';
  }
}
