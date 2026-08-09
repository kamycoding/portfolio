import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PrivacyPolicy } from './privacy-policy';

describe('PrivacyPolicy', () => {
  let fixture: ComponentFixture<PrivacyPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicy],
      providers: [provideRouter([])],
    }).compileComponents();

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

  it('reuses the shared light footer and provides a route back home', () => {
    const footer = fixture.nativeElement.querySelector('app-footer') as HTMLElement | null;
    const backLink = fixture.nativeElement.querySelector(
      '.privacy-policy__back',
    ) as HTMLAnchorElement | null;
    const privacyLink = footer?.querySelector(
      'a[href="/privacy-policy"]',
    ) as HTMLAnchorElement | null;

    expect(footer?.querySelector('.site-footer--light')).not.toBeNull();
    expect(backLink?.getAttribute('href')).toBe('/');
    expect(privacyLink).not.toBeNull();
  });
});
