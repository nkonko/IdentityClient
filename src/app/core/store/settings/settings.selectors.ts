import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectSettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.settings
);

export const selectCompanyName = createSelector(
  selectSettings,
  (settings) => settings?.companyName || ''
);

export const selectSupportEmail = createSelector(
  selectSettings,
  (settings) => settings?.supportEmail || ''
);

export const selectIsLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.isLoading
);

export const selectError = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.error
);
