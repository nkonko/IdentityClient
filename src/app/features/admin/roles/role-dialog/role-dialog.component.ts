import { Component, inject, OnInit, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { RoleDto } from '../../../../core/api/api-client';

export interface RoleDialogData {
  isPermissionsOnly: boolean;
  role?: RoleDto;
}

export interface RoleDialogResult {
  name?: string;
  permissions: string[];
}

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    ModalComponent,
    ButtonComponent,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
})
export class RoleDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Inputs para recibir data
  isOpen = input<boolean>(false);
  data = input<RoleDialogData>({ isPermissionsOnly: false });

  // Outputs para eventos
  close = output<void>();
  save = output<RoleDialogResult>();

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

  constructor() {
    // Initialize form
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]]
    });

    // React to data changes
    effect(() => {
      const dialogData = this.data();
      if (dialogData.role) {
        this.roleForm.patchValue({
          name: dialogData.role.name || ''
        });
        this.selectedPermissions = dialogData.role.permissions?.map(p => p.name || '') || [];
      } else {
        // Reset form for new role
        this.roleForm.reset();
        this.selectedPermissions = [];
      }
    });
  }

  ngOnInit() {
    // No longer needed, handled by effect
  }

  isPermissionSelected(permissionName: string): boolean {
    return this.selectedPermissions.includes(permissionName);
  }

  isCreatingNew(): boolean {
    return !this.data().isPermissionsOnly && !this.data().role;
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
    if (!this.data().isPermissionsOnly) {
      return this.roleForm.valid;
    }
    return true; // For permissions-only mode, always allow saving
  }

  onSave(): void {
    const dialogData = this.data();
    
    if (dialogData.isPermissionsOnly) {
      // Permissions-only mode: only return permissions
      const result: RoleDialogResult = {
        permissions: this.selectedPermissions
      };
      this.save.emit(result);
    } else if (this.isCreatingNew()) {
      // Creating new role: return name + permissions
      if (this.roleForm.valid) {
        const result: RoleDialogResult = {
          name: this.roleForm.value.name,
          permissions: this.selectedPermissions
        };
        this.save.emit(result);
      }
    } else {
      // Editing existing role name: only return name
      if (this.roleForm.valid) {
        const result: RoleDialogResult = {
          name: this.roleForm.value.name,
          permissions: [] // Don't include permissions when editing name
        };
        this.save.emit(result);
      }
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  getModalTitle(): string {
    const dialogData = this.data();
    if (dialogData.isPermissionsOnly) {
      return 'Gestionar Permisos';
    }
    return dialogData.role ? 'Editar Rol' : 'Crear Rol';
  }

  getModalIcon(): string {
    const dialogData = this.data();
    if (dialogData.isPermissionsOnly) {
      return 'key';
    }
    return dialogData.role ? 'edit' : 'add_circle';
  }

  getSaveButtonText(): string {
    const dialogData = this.data();
    if (dialogData.isPermissionsOnly) {
      return 'Guardar Permisos';
    }
    return dialogData.role ? 'Actualizar Rol' : 'Crear Rol';
  }
}

