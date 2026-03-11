import { inject, provideAppInitializer } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadFeatureFlags } from '../store/feature-flags/feature-flags.actions';

export const featureFlagsInitializer = provideAppInitializer(() => {
  const store = inject(Store);
  store.dispatch(loadFeatureFlags());
});
