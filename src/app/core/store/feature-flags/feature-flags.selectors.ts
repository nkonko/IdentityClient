import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureFlagsStoreState } from './feature-flags.reducer';

export const selectFeatureFlagsState = createFeatureSelector<FeatureFlagsStoreState>('featureFlags');

export const selectAllFeatureFlags = createSelector(
  selectFeatureFlagsState,
  (state: FeatureFlagsStoreState) => state.featureFlags
);

export const selectFeatureFlagsLoading = createSelector(
  selectFeatureFlagsState,
  (state: FeatureFlagsStoreState) => state.isLoading
);

export const selectFeatureFlagsLoaded = createSelector(
  selectFeatureFlagsState,
  (state: FeatureFlagsStoreState) => state.isLoaded
);

export const selectFeatureFlagsError = createSelector(
  selectFeatureFlagsState,
  (state: FeatureFlagsStoreState) => state.error
);

/**
 * Selector factory to check if a specific feature flag is enabled
 * @param flagName The name of the feature flag to check
 */
export const selectIsFeatureEnabled = (flagName: string) => createSelector(
  selectAllFeatureFlags,
  (featureFlags) => {
    const flag = featureFlags.find(f => f.name === flagName);
    return flag?.isEnabled ?? false;
  }
);

/**
 * Selector to get a map of all feature flags for easy lookup
 */
export const selectFeatureFlagsMap = createSelector(
  selectAllFeatureFlags,
  (featureFlags) => {
    const map: Record<string, boolean> = {};
    featureFlags.forEach(flag => {
      map[flag.name] = flag.isEnabled;
    });
    return map;
  }
);
