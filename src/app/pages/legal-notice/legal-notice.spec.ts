import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { LegalNotice } from './legal-notice';

describe('LegalNotice', () => {
  let fixture: ComponentFixture<LegalNotice>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNotice],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    await setTestLanguage(translate);
    fixture = TestBed.createComponent(LegalNotice);
    fixture.detectChanges();
  });

  it('renders the complete representative English legal notice content', () => {
    const content = fixture.nativeElement.textContent as string;
    const headings = fixture.nativeElement.querySelectorAll('h2') as NodeListOf<HTMLHeadingElement>;
    const emailLink = fixture.nativeElement.querySelector(
      'a[href="mailto:contact@kamycoding.com"]',
    ) as HTMLAnchorElement | null;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('Legal Notice');
    expect(content).toContain('Information pursuant to § 5 DDG');
    expect(content).toContain('Liability for External Links');
    expect(content).toContain('Copyright');
    expect(content).toContain('August 10, 2026');
    expect(headings).toHaveLength(6);
    expect(emailLink).not.toBeNull();
  });

  it('updates the legal notice body to German without navigation or reload', async () => {
    await setTestLanguage(translate, 'de');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('Impressum');
    expect(content).toContain('Angaben gemäß § 5 DDG');
    expect(content).toContain('Haftung für externe Links');
    expect(content).toContain('Urheberrecht');
    expect(content).toContain('10. August 2026');
    expect(content).not.toContain('Liability for External Links');
  });

  it('reuses the shared light footer and provides a route back home', () => {
    const footer = fixture.nativeElement.querySelector('app-footer') as HTMLElement | null;
    const backLink = fixture.nativeElement.querySelector(
      '.legal-page__back',
    ) as HTMLAnchorElement | null;

    expect(footer?.querySelector('.site-footer--light')).not.toBeNull();
    expect(backLink?.getAttribute('href')).toBe('/');
  });
});
