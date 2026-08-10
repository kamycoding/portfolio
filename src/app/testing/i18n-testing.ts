import type { Provider } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import DE_TRANSLATIONS from '../../../public/i18n/de.json';
import EN_TRANSLATIONS from '../../../public/i18n/en.json';

export function provideTestTranslateService(): Provider[] {
  return provideTranslateService({ fallbackLang: 'en' });
}

export async function setTestLanguage(
  translate: TranslateService,
  language: 'en' | 'de' = 'en',
): Promise<void> {
  translate.setTranslation('en', EN_TRANSLATIONS);
  translate.setTranslation('de', DE_TRANSLATIONS);
  await firstValueFrom(translate.use(language));
}
