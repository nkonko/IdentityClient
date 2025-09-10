import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoleState, adapter } from './roles.reducer';

export const selectRoleState = createFeatureSelector<RoleState>('roles');

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAllRoles = createSelector(
  selectRoleState,
  selectAll
);

export const selectRoleEntities = createSelector(
  selectRoleState,
  selectEntities
);

export const selectRoleById = (id: string) => createSelector(
  selectRoleEntities,
  (entities) => entities[id]
);

export const selectPermissions = createSelector(
  selectRoleState,
  (state) => state.permissions
);

export const selectLoading = createSelector(
  selectRoleState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectRoleState,
  (state) => state.error
);
