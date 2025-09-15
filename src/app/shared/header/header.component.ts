import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AuthFacade } from '../../core/facades/auth.facade';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectUser } from '../../core/store/auth/auth.selectors';
import { combineLatest } from 'rxjs';
import { LanguageService, Language } from '../../core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    FormsModule,
    RouterLink,
    TranslocoDirective
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly auth = inject(AuthFacade);
  private readonly store = inject(Store);
  private readonly languageService = inject(LanguageService);
  private readonly translocoService = inject(TranslocoService);

  @Output() toggleSidebar = new EventEmitter<void>();

  protected isDarkMode = false;

  // Signals for user info
  user = signal<{ name: string; roles: string[]; profilePictureUrl?: string | null } | null>(null);
  isLoading = signal<boolean>(true);

  // Language properties
  currentLanguage = signal<Language | undefined>(undefined);
  availableLanguages = this.languageService.availableLanguages;

  constructor() {
    // Optimized: Combine both store selectors into a single subscription
    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectIsLoading)
    ]).subscribe(([user, loading]) => {
      if (!user) { 
        this.user.set(null); 
        this.isLoading.set(loading);
        return; 
      }
      this.user.set({
        name: user.name,
        roles: Array.isArray(user.roles) ? user.roles : [],
        profilePictureUrl: user.profilePictureUrl ?? null
      });
      this.isLoading.set(loading);
    });

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(() => {
      this.currentLanguage.set(this.languageService.getCurrentLanguageInfo());
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  logout() {
    this.auth.logout();
  }

  changeLanguage(languageCode: string) {
    this.languageService.setLanguage(languageCode);
  }

  ngOnInit() {
    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    document.body.classList.toggle('dark-theme', this.isDarkMode);

    // Initialize current language
    this.currentLanguage.set(this.languageService.getCurrentLanguageInfo());
  }
}

