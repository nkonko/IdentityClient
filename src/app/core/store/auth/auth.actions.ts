import { createAction, props } from '@ngrx/store';

// Modelo de usuario alineado con el perfil (UserDto)
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  position?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  lastLogin?: Date | null;
}

// Acciones de autenticación
export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const checkAuthStatus = createAction('[Auth] Check Auth Status');

export const checkAuthStatusSuccess = createAction(
  '[Auth] Check Auth Status Success',
  props<{ user: User; token: string }>()
);

export const checkAuthStatusFailure = createAction('[Auth] Check Auth Status Failure');

export const updateUserProfile = createAction(
  '[Auth] Update User Profile',
  props<{ user: Partial<User> }>()
);

export const updateUserProfileSuccess = createAction(
  '[Auth] Update User Profile Success',
  props<{ user: User }>()
);

export const updateUserProfileFailure = createAction(
  '[Auth] Update User Profile Failure',
  props<{ error: string }>()
);
