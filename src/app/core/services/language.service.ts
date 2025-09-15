import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app-language';
  private readonly DEFAULT_LANGUAGE = 'es';

  public readonly availableLanguages: Language[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  private currentLanguageSubject = new BehaviorSubject<string>(this.DEFAULT_LANGUAGE);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translocoService: TranslocoService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedLanguage && this.isValidLanguage(savedLanguage)) {
      this.setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLanguage = this.getBrowserLanguage();
      const detectedLanguage = this.isValidLanguage(browserLanguage) ? browserLanguage : this.DEFAULT_LANGUAGE;
      this.setLanguage(detectedLanguage);
    }
  }

  private getBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    return browserLang.split('-')[0]; // Get just the language part (e.g., 'es' from 'es-ES')
  }

  private isValidLanguage(languageCode: string): boolean {
    return this.availableLanguages.some(lang => lang.code === languageCode);
  }

  public setLanguage(languageCode: string): void {
    if (!this.isValidLanguage(languageCode)) {
      console.warn(`Language code '${languageCode}' is not supported. Using default: ${this.DEFAULT_LANGUAGE}`);
      languageCode = this.DEFAULT_LANGUAGE;
    }

    // Set the language in Transloco
    this.translocoService.setActiveLang(languageCode);
    
    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, languageCode);
    
    // Update the subject
    this.currentLanguageSubject.next(languageCode);
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public getCurrentLanguageInfo(): Language | undefined {
    const currentLang = this.getCurrentLanguage();
    return this.availableLanguages.find(lang => lang.code === currentLang);
  }

  public toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  public getLanguageName(code: string): string {
    const language = this.availableLanguages.find(lang => lang.code === code);
    return language?.name || code;
  }
}