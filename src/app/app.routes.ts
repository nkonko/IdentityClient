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
    path: 'home',
    canActivate: [authGuard],
    data: { title: 'Home' },
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    data: { title: 'My Profile' },
    loadComponent: () => import('./features/profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
