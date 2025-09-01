import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  redirectBasedOnAuth() {
    const hasToken = !!this.tokenService.getToken();
    const currentUrl = this.router.url;

    // Si está autenticado y está en una página pública, redirigir a dashboard
    if (hasToken && ['/login', '/register', '/recover', '/'].includes(currentUrl)) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Si no está autenticado y está en una página privada, redirigir a login
    if (!hasToken && currentUrl === '/dashboard') {
      this.router.navigate(['/login']);
      return;
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
