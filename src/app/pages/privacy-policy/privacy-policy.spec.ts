import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { PrivacyPolicy } from './privacy-policy';

describe('PrivacyPolicy', () => {
  let fixture: ComponentFixture<PrivacyPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicy],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    }).compileComponents();

    await setTestLanguage(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(PrivacyPolicy);
    fixture.detectChanges();
  });

  it('creates the page with its primary heading', () => {
    const heading = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement | null;

    expect(fixture.componentInstance).toBeTruthy();
    expect(heading?.textContent).toBe('Privacy Policy');
    expect(fixture.nativeElement.querySelectorAll('h1')).toHaveLength(1);
  });

  it('renders controller information and a contact email link', () => {
    const content = fixture.nativeElement.textContent as string;
    const emailLink = fixture.nativeElement.querySelector(
      'a[href="mailto:contact@kamycoding.com"]',
    ) as HTMLAnchorElement | null;

    expect(content).toContain('1. Controller');
    expect(content).toContain('Kamyar Zamanfar');
    expect(content).toContain('Alte Poststraße 14');
    expect(emailLink?.textContent).toBe('contact@kamycoding.com');
  });

  it('describes the production hosting and contact delivery providers', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('Frontend hosting: Netlify');
    expect(content).toContain('Backend hosting: Apply.Build');
    expect(content).toContain('Codebite Oy');
    expect(content).toContain('transactional email delivery provider');
    expect(content).toContain('mail.zoho.eu');
    expect(content).not.toContain('Hosting provider information will be added');
  });

  it('keeps the authoritative legal body in English when the interface is German', async () => {
    await setTestLanguage(TestBed.inject(TranslateService), 'de');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('2. General Information');
    expect(content).toContain('The protection of your personal data is important to me.');
    expect(content).not.toContain('Allgemeine Informationen');
  });

  it('reuses the shared light footer and provides a route back home', () => {
    const footer = fixture.nativeElement.querySelector('app-footer') as HTMLElement | null;
    const backLink = fixture.nativeElement.querySelector(
      '.legal-page__back',
    ) as HTMLAnchorElement | null;
    const privacyLink = footer?.querySelector(
      'a[href="/privacy-policy"]',
    ) as HTMLAnchorElement | null;

    expect(footer?.querySelector('.site-footer--light')).not.toBeNull();
    expect(backLink?.getAttribute('href')).toBe('/');
    expect(privacyLink).not.toBeNull();
  });
});
