import { createReducer, on } from '@ngrx/store';
import { FeatureFlagState } from '../../models';
import * as FeatureFlagsActions from './feature-flags.actions';

export interface FeatureFlagsStoreState {
  featureFlags: FeatureFlagState[];
  isLoading: boolean;
  isLoaded: boolean;
  error: any | null;
}

export const initialState: FeatureFlagsStoreState = {
  featureFlags: [],
  isLoading: false,
  isLoaded: false,
  error: null
};

export const featureFlagsReducer = createReducer(
  initialState,

  // Load Feature Flags
  on(FeatureFlagsActions.loadFeatureFlags, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(FeatureFlagsActions.loadFeatureFlagsSuccess, (state, { featureFlags }) => ({
    ...state,
    featureFlags,
    isLoading: false,
    isLoaded: true,
    error: null
  })),

  on(FeatureFlagsActions.loadFeatureFlagsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    error
  })),

  // Refresh Feature Flags (same as load but can be called again)
  on(FeatureFlagsActions.refreshFeatureFlags, (state) => ({
    ...state,
    isLoading: true,
    error: null
  }))
);
