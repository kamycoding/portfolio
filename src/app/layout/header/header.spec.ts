import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LANGUAGE_STORAGE_KEY } from '../../core/i18n/language.service';
import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { Header } from './header';

class IntersectionObserverStub {
  readonly observe = vi.fn();
  readonly disconnect = vi.fn();
}

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let translate: TranslateService;

  beforeEach(async () => {
    localStorage.clear();
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: IntersectionObserverStub,
    });

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    await setTestLanguage(translate);
    fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('uses the shared language state and updates representative navigation copy', async () => {
    const languageToggle = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('EN'));

    expect(languageToggle).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('About me');

    languageToggle?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(translate.currentLang()).toBe('de');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
    expect(fixture.nativeElement.textContent).toContain('Über mich');
    expect(languageToggle?.getAttribute('aria-label')).toBe('Sprache auf Englisch umstellen');
  });
});
