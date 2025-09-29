import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RoleDto } from '../../../../core/api/api-client';

export interface RoleDialogData {
  isPermissionsOnly: boolean;
  role?: RoleDto;
}

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
})
export class RoleDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<RoleDialogComponent>);

  roleForm: FormGroup;
  selectedPermissions: string[] = [];
  
  // Predefined permissions for better UX
  availablePermissions: { name: string; description: string }[] = [
    { name: 'users.view', description: 'Ver usuarios del sistema' },
    { name: 'users.create', description: 'Crear nuevos usuarios' },
    { name: 'users.edit', description: 'Editar información de usuarios' },
    { name: 'users.delete', description: 'Eliminar usuarios del sistema' },
    { name: 'users.manage_status', description: 'Cambiar estado de usuarios (activo/inactivo/bloqueado)' },
    { name: 'roles.view', description: 'Ver roles del sistema' },
    { name: 'roles.create', description: 'Crear nuevos roles' },
    { name: 'roles.edit', description: 'Editar roles existentes' },
    { name: 'roles.delete', description: 'Eliminar roles del sistema' },
    { name: 'roles.manage_permissions', description: 'Gestionar permisos de roles' },
    { name: 'dashboard.admin', description: 'Acceso completo al panel de administración' },
    { name: 'reports.view', description: 'Ver reportes del sistema' },
    { name: 'reports.export', description: 'Exportar reportes' },
    { name: 'system.settings', description: 'Configurar ajustes del sistema' },
    { name: 'system.logs', description: 'Ver logs del sistema' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: RoleDialogData) {
    // Initialize form
    this.roleForm = this.fb.group({
      name: [data.role?.name || '', [Validators.required]]
    });

    // Initialize selected permissions
    this.selectedPermissions = data.role?.permissions?.map(p => p.name || '') || [];
  }

  ngOnInit() {
    // No additional initialization needed
  }

  isPermissionSelected(permissionName: string): boolean {
    return this.selectedPermissions.includes(permissionName);
  }

  onPermissionToggle(permissionName: string, event: any) {
    if (event.checked) {
      if (!this.selectedPermissions.includes(permissionName)) {
        this.selectedPermissions.push(permissionName);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permissionName);
    }
  }

  getSelectedPermissions(): string[] {
    return this.selectedPermissions;
  }

  removePermission(permissionName: string): void {
    this.selectedPermissions = this.selectedPermissions.filter(p => p !== permissionName);
  }

  getPermissionIcon(permissionName: string): string {
    if (permissionName.includes('user')) return 'person';
    if (permissionName.includes('role')) return 'security';
    if (permissionName.includes('dashboard')) return 'dashboard';
    if (permissionName.includes('report')) return 'assessment';
    if (permissionName.includes('system')) return 'settings';
    if (permissionName.includes('view')) return 'visibility';
    if (permissionName.includes('create')) return 'add';
    if (permissionName.includes('edit')) return 'edit';
    if (permissionName.includes('delete')) return 'delete';
    return 'key';
  }

  getPermissionTypeClass(permissionName: string): string {
    if (permissionName.includes('delete')) return 'danger';
    if (permissionName.includes('create') || permissionName.includes('edit')) return 'warning';
    if (permissionName.includes('view')) return 'info';
    return 'primary';
  }

  canSave(): boolean {
    if (!this.data.isPermissionsOnly) {
      return this.roleForm.valid;
    }
    return true; // For permissions-only mode, always allow saving
  }

  onSave(): void {
    if (!this.data.isPermissionsOnly) {
      // Validate form for role creation/editing
      if (this.roleForm.valid) {
        const result = {
          name: this.roleForm.value.name,
          permissions: this.selectedPermissions
        };
        this.dialogRef.close(result);
      }
    } else {
      // Just return permissions for permissions-only mode
      const result = {
        permissions: this.selectedPermissions
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

