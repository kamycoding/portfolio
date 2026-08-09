import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { LocalizedTitleStrategy } from './localized-title.strategy';

@Component({ template: '' })
class TestPage {}

describe('LocalizedTitleStrategy', () => {
  it('updates a keyed route title when the shared language changes', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'missing',
            component: TestPage,
            data: { titleKey: 'pageTitles.notFound' },
          },
        ]),
        ...provideTestTranslateService(),
        { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
      ],
    });

    const translate = TestBed.inject(TranslateService);
    await setTestLanguage(translate);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/missing', TestPage);
    TestBed.tick();

    expect(TestBed.inject(Title).getTitle()).toBe('Page Not Found | KamyCoding');

    await setTestLanguage(translate, 'de');
    TestBed.tick();

    expect(TestBed.inject(Title).getTitle()).toBe('Seite nicht gefunden | KamyCoding');
  });
});
