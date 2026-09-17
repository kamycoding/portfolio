import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../../../testing/i18n-testing';
import { About } from './about';

describe('About', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    });

    await setTestLanguage(TestBed.inject(TranslateService));
  });

  function createComponent(): { fixture: ComponentFixture<About>; host: HTMLElement } {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();

    return { fixture, host: fixture.nativeElement as HTMLElement };
  }

  it('renders the full biography with every paragraph translated', () => {
    const { host } = createComponent();

    const paragraphs = Array.from(host.querySelectorAll<HTMLParagraphElement>('p')).map(
      (paragraph) => paragraph.textContent?.trim() ?? '',
    );

    expect(paragraphs.some((text) => text.startsWith("I'm Kamyar, a Software Developer"))).toBe(
      true,
    );
    expect(
      paragraphs.some((text) => text.includes('My academic journey started in architecture')),
    ).toBe(true);
    expect(paragraphs.some((text) => text.includes('going for a run'))).toBe(true);
    expect(paragraphs.every((text) => !text.includes('about.paragraphs.'))).toBe(true);
  });

  it('keeps the trailing paragraphs collapsed until the toggle is used', () => {
    const { fixture, host } = createComponent();

    const toggle = host.querySelector<HTMLButtonElement>('.about__toggle');
    const panel = host.querySelector<HTMLElement>('#about-biography');

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(toggle?.getAttribute('aria-controls')).toBe('about-biography');
    expect(toggle?.textContent?.trim()).toContain('Read more');
    expect(panel?.getAttribute('aria-hidden')).toBe('true');
    expect(panel?.hasAttribute('inert')).toBe(true);
    expect(panel?.classList.contains('about__collapsible--expanded')).toBe(false);

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(toggle?.textContent?.trim()).toContain('Show less');
    expect(panel?.getAttribute('aria-hidden')).toBeNull();
    expect(panel?.hasAttribute('inert')).toBe(false);
    expect(panel?.classList.contains('about__collapsible--expanded')).toBe(true);

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(panel?.hasAttribute('inert')).toBe(true);
  });

  it('translates the biography and toggle labels in German', async () => {
    await setTestLanguage(TestBed.inject(TranslateService), 'de');
    const { fixture, host } = createComponent();

    expect(host.textContent).toContain('Ich bin Kamyar, Software Developer');
    expect(host.textContent).toContain('Mein akademischer Weg begann in der Architektur');
    expect(host.textContent).toContain('Beim Laufen bekomme ich den Kopf frei');

    const toggle = host.querySelector<HTMLButtonElement>('.about__toggle');
    expect(toggle?.textContent?.trim()).toContain('Mehr lesen');

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.textContent?.trim()).toContain('Weniger anzeigen');
  });
});
