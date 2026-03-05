import { createAction, props } from '@ngrx/store';
import { Settings } from '../../models';

export const loadSettings = createAction('[Settings] Load Settings');

export const loadSettingsSuccess = createAction(
  '[Settings] Load Settings Success',
  props<{ settings: Settings }>()
);

export const loadSettingsFailure = createAction(
  '[Settings] Load Settings Failure',
  props<{ error: any }>()
);

export const updateSettings = createAction(
  '[Settings] Update Settings',
  props<{ settings: Settings }>()
);

export const updateSettingsSuccess = createAction(
  '[Settings] Update Settings Success',
  props<{ settings: Settings }>()
);

export const updateSettingsFailure = createAction(
  '[Settings] Update Settings Failure',
  props<{ error: any }>()
);
