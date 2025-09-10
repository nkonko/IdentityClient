import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { RoleDto, PermissionDto } from '../../api/api-client';
import * as RoleActions from './roles.actions';

export interface RoleState extends EntityState<RoleDto> {
  permissions: PermissionDto[];
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<RoleDto> = createEntityAdapter<RoleDto>();

export const initialState: RoleState = adapter.getInitialState({
  permissions: [],
  loading: false,
  error: null,
});

export const roleReducer = createReducer(
  initialState,

  on(RoleActions.loadRoles, RoleActions.createRole, RoleActions.updateRole, RoleActions.deleteRole, RoleActions.loadPermissions, RoleActions.updatePermissions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(RoleActions.loadRolesSuccess, (state, { roles }) => {
    return adapter.setAll(roles, { ...state, loading: false });
  }),

  on(RoleActions.createRoleSuccess, (state, { role }) => {
    return adapter.addOne(role, { ...state, loading: false });
  }),

  on(RoleActions.updateRoleSuccess, (state, { role }) => {
    return adapter.upsertOne(role, { ...state, loading: false });
  }),

  on(RoleActions.deleteRoleSuccess, (state, { id }) => {
    return adapter.removeOne(id, { ...state, loading: false });
  }),

  on(RoleActions.loadPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    permissions,
    loading: false,
  })),

  on(RoleActions.updatePermissionsSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(
    RoleActions.loadRolesFailure,
    RoleActions.createRoleFailure,
    RoleActions.updateRoleFailure,
    RoleActions.deleteRoleFailure,
    RoleActions.loadPermissionsFailure,
    RoleActions.updatePermissionsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
