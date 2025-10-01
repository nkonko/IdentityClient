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
    data: { isPublic: true },
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [redirectIfAuthenticated],
    data: { isPublic: true },
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'recover',
    canActivate: [redirectIfAuthenticated],
    data: { isPublic: true },
    loadComponent: () => import('./features/recover/recover.component').then(m => m.RecoverComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    data: { title: 'Welcome' },
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    data: { title: 'My Profile', subtitle: 'Manage your personal information, security and notifications' },
    loadComponent: () => import('./features/profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard, adminGuard],
     data: { title: 'User Management', subtitle: 'Manage users' },
    loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'roles',
    canActivate: [authGuard, adminGuard],
    data: { title: 'Role Management', subtitle: 'Manage user roles and permissions' },
    loadComponent: () => import('./features/admin/roles/role-management/role-management.component').then(m => m.RoleManagementComponent)
  },
  {
    path: 'audit',
    canActivate: [authGuard, adminGuard],
    data: { title: 'Audit Logs', subtitle: 'View system activity and user actions' },
    loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard, adminGuard],
    data: { title: 'System Settings', subtitle: 'Configure application settings and preferences' },
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    data: { isPublic: true, isNotFound: true },
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
