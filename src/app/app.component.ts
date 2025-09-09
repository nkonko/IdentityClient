import { Component, inject, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AuthFacade } from './core/facades/auth.facade';
import { NavigationService } from './core/services/navigation.service';
import { Subscription, filter } from 'rxjs';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);

  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;
  protected isAuthenticated = false;

  // Sidebar state
  protected isSidebarCollapsed = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Compute if we should use content container: only when authenticated and not on public routes
  protected useContentContainer = false;

  private updateUseContainer() {
    // Determine current primary route path
    let child = this.route.firstChild;
    while (child?.firstChild) child = child.firstChild;
    const path = child?.snapshot.routeConfig?.path ?? '';
    const isPublic = path === 'login' || path === 'register' || path === 'recover' || path === '**';
    this.useContentContainer = this.isAuthenticated && !isPublic;
  }

  ngOnInit() {
    this.auth.checkAuthStatus();
    this.isAuthenticated = this.auth.isAuthenticated;
    this.updateUseContainer();

    this.authSubscription = this.auth.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.navigationService.redirectBasedOnAuth();
      this.updateUseContainer();
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.navigationService.redirectBasedOnAuth();
      this.updateUseContainer();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }
}
