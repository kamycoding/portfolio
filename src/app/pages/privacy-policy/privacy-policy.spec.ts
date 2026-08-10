import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { PrivacyPolicy } from './privacy-policy';

describe('PrivacyPolicy', () => {
  let fixture: ComponentFixture<PrivacyPolicy>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicy],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    await setTestLanguage(translate);
    fixture = TestBed.createComponent(PrivacyPolicy);
    fixture.detectChanges();
  });

  it('renders the complete representative English privacy policy content', () => {
    const content = fixture.nativeElement.textContent as string;
    const headings = fixture.nativeElement.querySelectorAll('h2') as NodeListOf<HTMLHeadingElement>;
    const emailLink = fixture.nativeElement.querySelector(
      'a[href="mailto:contact@kamycoding.com"]',
    ) as HTMLAnchorElement | null;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('Privacy Policy');
    expect(content).toContain('3. Website Hosting – Netlify');
    expect(content).toContain('Codebite Oy');
    expect(content).toContain('7. Email Delivery via Brevo');
    expect(content).toContain('Zoho Corporation B.V.');
    expect(content).toContain('18. Changes to this Privacy Policy');
    expect(headings).toHaveLength(18);
    expect(emailLink?.textContent).toBe('contact@kamycoding.com');
  });

  it('updates the privacy policy body to German without navigation or reload', async () => {
    await setTestLanguage(translate, 'de');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('Datenschutzerklärung');
    expect(content).toContain('3. Hosting der Website – Netlify');
    expect(content).toContain('6. Serverseitige Validierung und Missbrauchsschutz');
    expect(content).toContain('14. Ihre Rechte nach der DSGVO');
    expect(content).toContain('18. Änderung dieser Datenschutzerklärung');
    expect(content).not.toContain('Changes to this Privacy Policy');
  });

  it('keeps the shared layout, privacy route, and contact email link intact', () => {
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
