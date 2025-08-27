import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthFacade } from './facades/auth.facade';
import { NavigationService } from './services/navigation.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  isAuthenticated = false;

  ngOnInit() {
    // Verificar estado inicial
    this.auth.checkAuthStatus();
    this.isAuthenticated = this.auth.isAuthenticated;

    // Suscribirse a cambios en el estado de autenticación
    this.authSubscription = this.auth.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;
        // Redirigir basado en el nuevo estado de autenticación
        this.navigationService.redirectBasedOnAuth();
      }
    );

    // Suscribirse a cambios de navegación para verificar redirecciones
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.navigationService.redirectBasedOnAuth();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }
}
