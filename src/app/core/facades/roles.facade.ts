import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IdentityClient, PermissionDto, RoleCreateDto, RoleUpdateDto } from '../api/api-client';
import * as RoleActions from '../store/roles/roles.actions';
import * as fromRoles from '../store/roles/roles.selectors';
import { RoleState } from '../store/roles/roles.reducer';

@Injectable({ providedIn: 'root' })
export class RolesFacade {
  private readonly store = inject(Store<RoleState>);
  private readonly apiClient = inject(IdentityClient);

  roles$ = this.store.select(fromRoles.selectAllRoles);
  permissions$ = this.store.select(fromRoles.selectPermissions);
  loading$ = this.store.select(fromRoles.selectLoading);
  error$ = this.store.select(fromRoles.selectError);

  loadRoles() {
    this.store.dispatch(RoleActions.loadRoles());
  }

  createRole(role: { name: string; permissions: string[] }) {
    this.store.dispatch(RoleActions.createRole({ role }));
  }

  updateRole(role: { id: string; name: string; permissions: string[] }) {
    this.store.dispatch(RoleActions.updateRole({ role }));
  }

  deleteRole(id: string) {
    this.store.dispatch(RoleActions.deleteRole({ id }));
  }

  loadPermissions(roleId: string) {
    this.store.dispatch(RoleActions.loadPermissions({ roleId }));
  }

  updatePermissions(roleId: string, permissions: string[]) {
    this.store.dispatch(RoleActions.updatePermissions({ roleId, permissions }));
  }

  // Direct API calls that might be needed for the effects
  getRolesApi() {
    return this.apiClient.rolesAll();
  }

  createRoleApi(role: { name: string; permissions: string[] }) {
    return this.apiClient.rolesPOST(new RoleCreateDto({ name: role.name }));
  }

  updateRoleApi(role: { id: string; name: string; }) {
    return this.apiClient.rolesPUT(role.id, new RoleUpdateDto({ name: role.name }));
  }

  deleteRoleApi(id: string) {
    return this.apiClient.rolesDELETE(id);
  }

  getPermissionsApi(roleId: string) {
    return this.apiClient.permissionsAll(roleId);
  }

  updatePermissionsApi(roleId: string, permissions: string[]) {
    const permissionDtos: PermissionDto[] = permissions.map(p => new PermissionDto({ name: p }));
    return this.apiClient.permissions(roleId, permissionDtos);
  }
}
