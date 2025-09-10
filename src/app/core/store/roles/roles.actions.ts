import { createAction, props } from '@ngrx/store';
import { RoleDto, PermissionDto } from '../../api/api-client';

export const loadRoles = createAction('[Role] Load Roles');

export const loadRolesSuccess = createAction(
  '[Role] Load Roles Success',
  props<{ roles: RoleDto[] }>()
);

export const loadRolesFailure = createAction(
  '[Role] Load Roles Failure',
  props<{ error: any }>()
);

export const createRole = createAction(
  '[Role] Create Role',
  props<{ role: { name: string; permissions: string[] } }>()
);

export const createRoleSuccess = createAction(
  '[Role] Create Role Success',
  props<{ role: RoleDto }>()
);

export const createRoleFailure = createAction(
  '[Role] Create Role Failure',
  props<{ error: any }>()
);

export const updateRole = createAction(
  '[Role] Update Role',
  props<{ role: { id: string; name: string; permissions: string[] } }>()
);

export const updateRoleSuccess = createAction(
  '[Role] Update Role Success',
  props<{ role: RoleDto }>()
);

export const updateRoleFailure = createAction(
  '[Role] Update Role Failure',
  props<{ error: any }>()
);

export const deleteRole = createAction(
  '[Role] Delete Role',
  props<{ id: string }>()
);

export const deleteRoleSuccess = createAction(
  '[Role] Delete Role Success',
  props<{ id: string }>()
);

export const deleteRoleFailure = createAction(
  '[Role] Delete Role Failure',
  props<{ error: any }>()
);

export const loadPermissions = createAction(
  '[Role] Load Permissions',
  props<{ roleId: string }>()
);

export const loadPermissionsSuccess = createAction(
  '[Role] Load Permissions Success',
  props<{ permissions: PermissionDto[] }>()
);

export const loadPermissionsFailure = createAction(
  '[Role] Load Permissions Failure',
  props<{ error: any }>()
);

export const updatePermissions = createAction(
  '[Role] Update Permissions',
  props<{ roleId: string; permissions: string[] }>()
);

export const updatePermissionsSuccess = createAction(
  '[Role] Update Permissions Success'
);

export const updatePermissionsFailure = createAction(
  '[Role] Update Permissions Failure',
  props<{ error: any }>()
);
