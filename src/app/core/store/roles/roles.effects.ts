import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RolesFacade } from '../../facades/roles.facade';
import * as RoleActions from './roles.actions';

@Injectable()
export class RoleEffects {
  private readonly actions$ = inject(Actions);
  private readonly rolesFacade = inject(RolesFacade);

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.loadRoles),
      mergeMap(() =>
        this.rolesFacade.getRolesApi().pipe(
          map((roles) => RoleActions.loadRolesSuccess({ roles })),
          catchError((error) => of(RoleActions.loadRolesFailure({ error })))
        )
      )
    )
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.createRole),
      mergeMap(({ role }) =>
        this.rolesFacade.createRoleApi(role).pipe(
          map((newRole) => RoleActions.createRoleSuccess({ role: newRole })),
          catchError((error) => of(RoleActions.createRoleFailure({ error })))
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.updateRole),
      mergeMap(({ role }) =>
        this.rolesFacade.updateRoleApi(role).pipe(
          // The API returns void, so we need to construct the updated role
          map(() => RoleActions.updateRoleSuccess({ role: { id: role.id, name: role.name, permissions: role.permissions } as any})),
          catchError((error) => of(RoleActions.updateRoleFailure({ error })))
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.deleteRole),
      mergeMap(({ id }) =>
        this.rolesFacade.deleteRoleApi(id).pipe(
          map(() => RoleActions.deleteRoleSuccess({ id })),
          catchError((error) => of(RoleActions.deleteRoleFailure({ error })))
        )
      )
    )
  );

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.loadPermissions),
      mergeMap(({ roleId }) =>
        this.rolesFacade.getPermissionsApi(roleId).pipe(
          map((permissions) => RoleActions.loadPermissionsSuccess({ permissions })),
          catchError((error) => of(RoleActions.loadPermissionsFailure({ error })))
        )
      )
    )
  );

  updatePermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.updatePermissions),
      mergeMap(({ roleId, permissions }) =>
        this.rolesFacade.updatePermissionsApi(roleId, permissions).pipe(
          map(() => RoleActions.updatePermissionsSuccess()),
          catchError((error) => of(RoleActions.updatePermissionsFailure({ error })))
        )
      )
    )
  );
}
