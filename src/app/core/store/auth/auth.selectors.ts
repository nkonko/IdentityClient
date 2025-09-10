import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectores básicos
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

// Selectores específicos para roles
export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.roles || null
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (roles: string[] | null) => roles?.includes('Admin')
);

export const selectIsUser = createSelector(
  selectUserRole,
  (roles: string[] | null) => roles?.includes('User')
);

// Selectores combinados
export const selectUserInfo = createSelector(
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  (user, isAuthenticated, isAdmin) => ({
    user,
    isAuthenticated,
    isAdmin
  })
);
