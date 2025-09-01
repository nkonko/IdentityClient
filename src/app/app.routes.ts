import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './core/services/token.service';
import { adminGuard } from './core/guards/admin.guard';

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
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [redirectIfAuthenticated],
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'recover',
    canActivate: [redirectIfAuthenticated],
    loadComponent: () => import('./features/recover/recover.component').then(m => m.RecoverComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
