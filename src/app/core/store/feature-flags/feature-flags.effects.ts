import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FeatureFlagsFacade } from '../../facades/feature-flags.facade';
import * as FeatureFlagsActions from './feature-flags.actions';

@Injectable()
export class FeatureFlagsEffects {
  private readonly actions$ = inject(Actions);
  private readonly featureFlagsFacade = inject(FeatureFlagsFacade);

  loadFeatureFlags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureFlagsActions.loadFeatureFlags, FeatureFlagsActions.refreshFeatureFlags),
      mergeMap(() =>
        this.featureFlagsFacade.getAllStates().pipe(
          map((featureFlags) => FeatureFlagsActions.loadFeatureFlagsSuccess({ featureFlags })),
          catchError((error) => of(FeatureFlagsActions.loadFeatureFlagsFailure({ error })))
        )
      )
    )
  );
}
