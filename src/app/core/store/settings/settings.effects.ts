import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SettingsFacade } from '../../facades/settings.facade';
import * as SettingsActions from './settings.actions';

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly settingsFacade = inject(SettingsFacade);

  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadSettings),
      mergeMap(() =>
        this.settingsFacade.getSettings().pipe(
          map((settings) => SettingsActions.loadSettingsSuccess({ settings })),
          catchError((error) => of(SettingsActions.loadSettingsFailure({ error })))
        )
      )
    )
  );

  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateSettings),
      mergeMap(({ settings }) =>
        this.settingsFacade.updateSettings(settings).pipe(
          map(() => SettingsActions.updateSettingsSuccess({ settings })),
          catchError((error) => of(SettingsActions.updateSettingsFailure({ error })))
        )
      )
    )
  );
}
