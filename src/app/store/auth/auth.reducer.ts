import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })),

  // Check Auth Status
  on(AuthActions.checkAuthStatus, (state) => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.checkAuthStatusSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.checkAuthStatusFailure, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })),

  // Update User Profile
  on(AuthActions.updateUserProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
