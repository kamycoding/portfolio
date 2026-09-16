import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../../../testing/i18n-testing';
import { Projects } from './projects';

describe('Projects', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Projects],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    });

    await setTestLanguage(TestBed.inject(TranslateService));
  });

  it('renders the four translated homepage projects in order', () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const cards = Array.from(host.querySelectorAll<HTMLElement>('.projects__card'));

    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.querySelector('h3')?.textContent?.trim())).toEqual([
      'Heldio',
      'Join',
      'Portfolio Website',
      'El Pollo Loco',
    ]);
    expect(host.textContent).not.toContain('DABubble');
    expect(cards[0].classList).toContain('projects__card--featured');
    expect(cards[0].querySelector('.projects__badge')?.getAttribute('alt')).toBe(
      'Featured project',
    );
    expect(cards[0].querySelector('.projects__technology-label')?.textContent).toContain(
      'Planned stack',
    );
    expect(cards.every((card) => !card.textContent?.includes('projects.items.'))).toBe(true);

    const technologyIcons = Array.from(
      host.querySelectorAll<HTMLElement>('iconify-icon.projects__technology-icon'),
    );
    expect(technologyIcons).toHaveLength(21);
    expect(
      technologyIcons.every(
        (icon) =>
          icon.getAttribute('aria-hidden') === 'true' &&
          /^(devicon|logos):[\w-]+$/.test(icon.getAttribute('icon') ?? ''),
      ),
    ).toBe(true);

    const technologyLabels = Array.from(
      host.querySelectorAll<HTMLElement>('.projects__technologies li span'),
    );
    expect(technologyLabels).toHaveLength(21);
    expect(technologyLabels.every((label) => Boolean(label.textContent?.trim()))).toBe(true);
  });

  it('links every card to its project detail route', () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('.projects__details-link a'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/projects/heldio',
      '/projects/join',
      '/projects/sogand-personal-website',
      '/projects/el-pollo-loco',
    ]);
  });

  it('resolves the new showcase copy in German', async () => {
    await setTestLanguage(TestBed.inject(TranslateService), 'de');
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.projects__badge')?.getAttribute('alt')).toBe(
      'Ausgewähltes Projekt',
    );
    expect(host.querySelector('.projects__technology-label')?.textContent).toContain(
      'Geplanter Stack',
    );
    expect(host.textContent).toContain('kontextbezogenes Sprachenlernen');
    expect(host.textContent).toContain('UX/UI- und Produktdesignerin');
  });
});
