import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './services/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  return !!tokenService.getToken();
};

export const redirectIfAuthenticated: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  return !tokenService.getToken();
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [redirectIfAuthenticated],
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [redirectIfAuthenticated],
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'recover',
    canActivate: [redirectIfAuthenticated],
    loadComponent: () => import('./components/recover/recover.component').then(m => m.RecoverComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
