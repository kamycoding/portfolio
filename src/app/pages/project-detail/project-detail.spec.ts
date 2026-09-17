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
      'Join Kanban',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Implementation Details');
    expect(harness.routeNativeElement?.querySelectorAll('app-cta-link')).toHaveLength(2);
    expect(harness.routeNativeElement?.querySelector('app-brand-stamp')).not.toBeNull();
    expect(title.getTitle()).toBe('Join | KamyCoding');

    await setTestLanguage(translate, 'de');
    TestBed.tick();
    expect(title.getTitle()).toBe('Join | KamyCoding');

    await setTestLanguage(translate);
    TestBed.tick();
    expect(title.getTitle()).toBe('Join | KamyCoding');

    await harness.navigateByUrl('/projects/el-pollo-loco', ProjectDetail);
    expect(title.getTitle()).toBe('El Pollo Loco | KamyCoding');

    await harness.navigateByUrl('/projects/heldio', ProjectDetail);
    expect(getRouteElement<HTMLHeadingElement>('h1').textContent).toContain('Heldio');
    expect(harness.routeNativeElement?.querySelector('.project-detail__badge')).toBeNull();
    expect(title.getTitle()).toBe('Heldio | KamyCoding');
  });

  it('links to projects in the intended cyclic order', async () => {
    await harness.navigateByUrl('/projects/join', ProjectDetail);

    expect(getRouteElement<HTMLAnchorElement>('.project-detail__next').getAttribute('href')).toBe(
      '/projects/sogand-personal-website',
    );

    await harness.navigateByUrl('/projects/sogand-personal-website', ProjectDetail);

    expect(getRouteElement<HTMLAnchorElement>('.project-detail__next').getAttribute('href')).toBe(
      '/projects/el-pollo-loco',
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

  it('renders the production Join GitHub and live links as active external links', async () => {
    await harness.navigateByUrl('/projects/join', ProjectDetail);

    const disabledProjectLinks = harness.routeNativeElement?.querySelectorAll(
      '.project-detail__actions [aria-disabled="true"]',
    );
    const projectLinks = Array.from(
      harness.routeNativeElement?.querySelectorAll<HTMLAnchorElement>(
        '.project-detail__actions a',
      ) ?? [],
    );

    expect(disabledProjectLinks).toHaveLength(0);
    expect(projectLinks).toHaveLength(2);
    expect(projectLinks.map((link) => link.href)).toEqual([
      'https://github.com/kamycoding/join-kanban',
      'https://join.kamycoding.com/',
    ]);
    expect(projectLinks.every((link) => link.target === '_blank')).toBe(true);
    expect(projectLinks.every((link) => link.rel === 'noopener noreferrer')).toBe(true);
  });

  it('renders only the Heldio live link and omits the absent repository CTA', async () => {
    await harness.navigateByUrl('/projects/heldio', ProjectDetail);

    const projectActions = getRouteElement<HTMLElement>('.project-detail__actions');
    const projectLinks = projectActions.querySelectorAll<HTMLAnchorElement>('a');

    expect(projectLinks).toHaveLength(1);
    expect(projectLinks[0].href).toBe('https://heldio.app/');
    expect(projectLinks[0].textContent).not.toContain('GitHub');
    expect(projectLinks[0].target).toBe('_blank');
    expect(projectLinks[0].rel).toBe('noopener noreferrer');
    expect(projectActions.querySelectorAll('[aria-disabled="true"]')).toHaveLength(0);
  });

  it('renders only the Sogand live link and omits the absent repository CTA', async () => {
    await harness.navigateByUrl('/projects/sogand-personal-website', ProjectDetail);

    const projectActions = getRouteElement<HTMLElement>('.project-detail__actions');
    const projectLinks = projectActions.querySelectorAll<HTMLAnchorElement>('a');

    expect(projectLinks).toHaveLength(1);
    expect(projectLinks[0].href).toBe('https://www.sogandasari.com/');
    expect(projectLinks[0].textContent).not.toContain('GitHub');
    expect(projectLinks[0].target).toBe('_blank');
    expect(projectLinks[0].rel).toBe('noopener noreferrer');
    expect(projectActions.querySelectorAll('[aria-disabled="true"]')).toHaveLength(0);
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
