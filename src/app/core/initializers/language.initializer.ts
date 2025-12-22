import { inject, provideAppInitializer } from '@angular/core';
import { LanguageService } from '../services/language.service';

export const languageInitializer = provideAppInitializer(() => {
  const languageService = inject(LanguageService);
  // Initialize language service - it will auto-detect browser language
  // and set Spanish as default if no valid language is detected
  return Promise.resolve();
});