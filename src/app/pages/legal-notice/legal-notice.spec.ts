import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LegalNotice } from './legal-notice';

describe('LegalNotice', () => {
  let fixture: ComponentFixture<LegalNotice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNotice],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNotice);
    fixture.detectChanges();
  });

  it('renders the supplied legal information and contact details', () => {
    const content = fixture.nativeElement.textContent as string;
    const emailLink = fixture.nativeElement.querySelector(
      'a[href="mailto:contact@kamycoding.com"]',
    ) as HTMLAnchorElement | null;

    expect(content).toContain('Information pursuant to § 5 DDG');
    expect(content).toContain('Kamyar Zamanfar');
    expect(content).toContain('Alte Poststraße 14');
    expect(content).toContain('August 9, 2026');
    expect(emailLink).not.toBeNull();
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
