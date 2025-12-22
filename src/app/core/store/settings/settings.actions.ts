import { createAction, props } from '@ngrx/store';
import { SettingsDto } from '../../api/api-client';

export const loadSettings = createAction('[Settings] Load Settings');

export const loadSettingsSuccess = createAction(
  '[Settings] Load Settings Success',
  props<{ settings: SettingsDto }>()
);

export const loadSettingsFailure = createAction(
  '[Settings] Load Settings Failure',
  props<{ error: any }>()
);

export const updateSettings = createAction(
  '[Settings] Update Settings',
  props<{ settings: SettingsDto }>()
);

export const updateSettingsSuccess = createAction(
  '[Settings] Update Settings Success',
  props<{ settings: SettingsDto }>()
);

export const updateSettingsFailure = createAction(
  '[Settings] Update Settings Failure',
  props<{ error: any }>()
);
