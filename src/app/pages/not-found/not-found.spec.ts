import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    }).compileComponents();

    await setTestLanguage(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the 404 message with one primary heading', () => {
    const content = fixture.nativeElement.textContent as string;
    const headings = fixture.nativeElement.querySelectorAll('h1') as NodeListOf<HTMLHeadingElement>;

    expect(content).toContain('Error 404');
    expect(content).toContain('Page not found');
    expect(content).toContain('doesn\u2019t exist');
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toBe('Page not found');
  });

  it('provides an Angular route back to the homepage', () => {
    const homeLink = fixture.nativeElement.querySelector(
      '.not-found__action--primary',
    ) as HTMLAnchorElement | null;

    expect(homeLink?.getAttribute('href')).toBe('/');
    expect(homeLink?.textContent?.trim()).toBe('Back to homepage');
  });
});
