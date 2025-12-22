import { createReducer, on } from '@ngrx/store';
import { SettingsDto } from '../../api/api-client';
import * as SettingsActions from './settings.actions';

export interface SettingsState {
  settings: SettingsDto | null;
  isLoading: boolean;
  error: any | null;
}

export const initialState: SettingsState = {
  settings: null,
  isLoading: false,
  error: null
};

export const settingsReducer = createReducer(
  initialState,

  // Load Settings
  on(SettingsActions.loadSettings, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(SettingsActions.loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    isLoading: false,
    error: null
  })),

  on(SettingsActions.loadSettingsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Settings
  on(SettingsActions.updateSettings, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(SettingsActions.updateSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    isLoading: false,
    error: null
  })),

  on(SettingsActions.updateSettingsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
