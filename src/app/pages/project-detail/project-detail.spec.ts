import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NotFound } from '../not-found/not-found';
import { ProjectDetail } from './project-detail';
import { projectDetailGuard } from './project-detail.guard';

describe('ProjectDetail', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'projects/:slug', component: ProjectDetail, canActivate: [projectDetailGuard] },
          { path: '**', component: NotFound },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('renders supported slugs from the shared project data and updates the document title', async () => {
    await harness.navigateByUrl('/projects/join', ProjectDetail);

    expect(getRouteElement<HTMLHeadingElement>('h1').textContent).toContain('Join');
    expect(getRouteElement<HTMLImageElement>('.project-detail__preview-image').alt).toContain(
      'Join task manager',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Implementation Details');
    expect(harness.routeNativeElement?.querySelectorAll('app-cta-link')).toHaveLength(2);
    expect(harness.routeNativeElement?.querySelector('app-brand-stamp')).toBeNull();
    expect(TestBed.inject(Title).getTitle()).toBe('Join | KamyCoding');

    await harness.navigateByUrl('/projects/dabubble', ProjectDetail);

    expect(getRouteElement<HTMLHeadingElement>('h1').textContent).toContain('DABubble');
    expect(harness.routeNativeElement?.querySelector('app-brand-stamp')).not.toBeNull();
    expect(TestBed.inject(Title).getTitle()).toBe('DABubble | KamyCoding');
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
