import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../../facades/auth.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly auth = inject(AuthFacade);

  isDarkMode = false;

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
