import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
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
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;
  protected isAuthenticated = false;

  // Sidebar state
  protected isSidebarCollapsed = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit() {
    this.auth.checkAuthStatus();
    this.isAuthenticated = this.auth.isAuthenticated;

    this.authSubscription = this.auth.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;
        this.navigationService.redirectBasedOnAuth();
      }
    );

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
