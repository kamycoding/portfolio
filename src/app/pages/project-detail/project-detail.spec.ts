import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { routes } from '../../app.routes';
import { LocalizedTitleStrategy } from '../../core/i18n/localized-title.strategy';
import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { ProjectDetail } from './project-detail';

describe('ProjectDetail', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        ...provideTestTranslateService(),
        { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
      ],
    });

    await setTestLanguage(TestBed.inject(TranslateService));
    harness = await RouterTestingHarness.create();
  });

  it('renders supported slugs from the shared project data and updates the document title', async () => {
    const translate = TestBed.inject(TranslateService);
    const title = TestBed.inject(Title);

    await harness.navigateByUrl('/projects/join', ProjectDetail);

    expect(getRouteElement<HTMLHeadingElement>('h1').textContent).toContain('Join');
    expect(getRouteElement<HTMLImageElement>('.project-detail__preview-image').alt).toContain(
      'Join task manager',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Implementation Details');
    expect(harness.routeNativeElement?.querySelectorAll('app-cta-link')).toHaveLength(2);
    expect(harness.routeNativeElement?.querySelector('app-brand-stamp')).toBeNull();
    expect(title.getTitle()).toBe('Join | KamyCoding');

    await setTestLanguage(translate, 'de');
    TestBed.tick();
    expect(title.getTitle()).toBe('Join | KamyCoding');

    await setTestLanguage(translate);
    TestBed.tick();
    expect(title.getTitle()).toBe('Join | KamyCoding');

    await harness.navigateByUrl('/projects/el-pollo-loco', ProjectDetail);
    expect(title.getTitle()).toBe('El Pollo Loco | KamyCoding');

    await harness.navigateByUrl('/projects/dabubble', ProjectDetail);

    expect(getRouteElement<HTMLHeadingElement>('h1').textContent).toContain('DABubble');
    expect(harness.routeNativeElement?.querySelector('app-brand-stamp')).not.toBeNull();
    expect(title.getTitle()).toBe('DABubble | KamyCoding');
  });

  it('links to projects in the intended cyclic order', async () => {
    await harness.navigateByUrl('/projects/join', ProjectDetail);

    expect(getRouteElement<HTMLAnchorElement>('.project-detail__next').getAttribute('href')).toBe(
      '/projects/el-pollo-loco',
    );

    await harness.navigateByUrl('/projects/el-pollo-loco', ProjectDetail);

    expect(getRouteElement<HTMLAnchorElement>('.project-detail__next').getAttribute('href')).toBe(
      '/projects/dabubble',
    );
  });

  it('renders the El Pollo Loco GitHub and live links as active external links', async () => {
    await harness.navigateByUrl('/projects/el-pollo-loco', ProjectDetail);

    const projectLinks = Array.from(
      harness.routeNativeElement?.querySelectorAll<HTMLAnchorElement>(
        '.project-detail__actions a',
      ) ?? [],
    );

    expect(projectLinks.map((link) => link.href)).toEqual([
      'https://github.com/kamycoding/El-Pollo-Loco',
      'https://elpolloloco.kamycoding.com/',
    ]);
    expect(projectLinks.every((link) => link.target === '_blank')).toBe(true);
    expect(projectLinks.every((link) => link.rel === 'noopener noreferrer')).toBe(true);
  });

  it('redirects an unsupported slug to the existing not-found route', async () => {
    await harness.navigateByUrl('/projects/unsupported');

    expect(TestBed.inject(Router).url).toBe('/not-found');
    expect(harness.routeNativeElement?.textContent).toContain('Page not found');
  });

  function getRouteElement<T extends Element>(selector: string): T {
    const element = harness.routeNativeElement?.querySelector(selector) as T | null;
    expect(element).not.toBeNull();
    return element as T;
  }
});
