import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { LANGUAGE_STORAGE_KEY, LanguageService } from './language.service';

class FakeTranslateService {
  readonly currentLang = signal<string | null>(null);
  browserLanguage: string | undefined = 'en';
  languages: string[] = [];

  addLangs(languages: string[]): void {
    this.languages = languages;
  }

  getBrowserLang(): string | undefined {
    return this.browserLanguage;
  }

  use(language: string): Observable<Record<string, never>> {
    this.currentLang.set(language);
    return of({});
  }
}

describe('LanguageService', () => {
  let service: LanguageService;
  let translate: FakeTranslateService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
    translate = new FakeTranslateService();

    TestBed.configureTestingModule({
      providers: [{ provide: TranslateService, useValue: translate }],
    });

    service = TestBed.inject(LanguageService);
  });

  it('initializes with a supported browser language', async () => {
    translate.browserLanguage = 'de';

    await service.initialize();
    TestBed.tick();

    expect(service.currentLanguage()).toBe('de');
    expect(document.documentElement.lang).toBe('de');
  });

  it('restores a valid stored preference before the browser language', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');
    translate.browserLanguage = 'en';

    await service.initialize();

    expect(service.currentLanguage()).toBe('de');
  });

  it('falls back safely when both persisted and browser languages are unsupported', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
    translate.browserLanguage = 'fr';

    await service.initialize();

    expect(service.currentLanguage()).toBe('en');
  });

  it('switches in both directions, persists the choice, and updates html lang', async () => {
    await service.initialize();
    await service.setLanguage('de');
    TestBed.tick();

    expect(service.currentLanguage()).toBe('de');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
    expect(document.documentElement.lang).toBe('de');

    await service.setLanguage('en');
    TestBed.tick();

    expect(service.currentLanguage()).toBe('en');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});
