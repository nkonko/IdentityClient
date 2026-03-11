import { createAction, props } from '@ngrx/store';
import { FeatureFlagState } from '../../models';

export const loadFeatureFlags = createAction('[FeatureFlags] Load Feature Flags');

export const loadFeatureFlagsSuccess = createAction(
  '[FeatureFlags] Load Feature Flags Success',
  props<{ featureFlags: FeatureFlagState[] }>()
);

export const loadFeatureFlagsFailure = createAction(
  '[FeatureFlags] Load Feature Flags Failure',
  props<{ error: any }>()
);

export const refreshFeatureFlags = createAction('[FeatureFlags] Refresh Feature Flags');
