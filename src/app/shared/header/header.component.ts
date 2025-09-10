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
    // Subscribe to store and update signal
    this.store.select(selectUser).subscribe((u: any) => {
      if (!u) { this.user.set(null); return; }
      this.user.set({
        name: u.name,
        roles: Array.isArray(u.roles) ? u.roles : [],
        profilePictureUrl: u.profilePictureUrl ?? null
      });
    });

    this.store.select(selectIsLoading).subscribe(loading => this.isLoading.set(loading));
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

