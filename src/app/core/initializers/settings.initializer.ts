import { inject, provideAppInitializer } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadSettings } from '../store/settings/settings.actions';

export const settingsInitializer = provideAppInitializer(() => {
  const store = inject(Store);
  store.dispatch(loadSettings());
});
