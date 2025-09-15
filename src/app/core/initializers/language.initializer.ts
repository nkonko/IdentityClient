import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { LanguageService } from '../services/language.service';

export function initializeLanguage(languageService: LanguageService) {
  return () => {
    // Initialize language service - it will auto-detect browser language
    // and set Spanish as default if no valid language is detected
    return Promise.resolve();
  };
}

export const languageInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializeLanguage,
  deps: [LanguageService],
  multi: true
};