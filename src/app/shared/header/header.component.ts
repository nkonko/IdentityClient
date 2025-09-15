import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../../core/facades/auth.facade';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectUser } from '../../core/store/auth/auth.selectors';
import { combineLatest } from 'rxjs';

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
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly auth = inject(AuthFacade);
  private readonly store = inject(Store);

  @Output() toggleSidebar = new EventEmitter<void>();

  protected isDarkMode = false;

  // Signals for user info
  user = signal<{ name: string; roles: string[]; profilePictureUrl?: string | null } | null>(null);
  isLoading = signal<boolean>(true);

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
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }
}

