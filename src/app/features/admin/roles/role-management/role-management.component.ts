import { Component, inject, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesFacade } from '../../../../core/facades/roles.facade';
import { RoleDto } from '../../../../core/api/api-client';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SectionTitleComponent } from '../../../../shared/section-title/section-title.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { RoleDialogComponent, RoleDialogData, RoleDialogResult } from '../role-dialog/role-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatButtonModule,
    SectionTitleComponent, 
    ButtonComponent,
    RoleDialogComponent
  ],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  private readonly rolesFacade = inject(RolesFacade);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  roles$: Observable<RoleDto[]> = this.rolesFacade.roles$;
  loading$: Observable<boolean> = this.rolesFacade.loading$;
  
  // Local state for pagination and filtering
  roles: RoleDto[] = [];
  searchTerm = '';
  
  // Filter properties
  showFilterDropdown = false;
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;

  // Modal state
  showRoleDialog = signal(false);
  roleDialogData = signal<RoleDialogData>({ isPermissionsOnly: false });

  ngOnInit() {
    this.rolesFacade.loadRoles();
    
    // Subscribe to roles and store them locally for pagination
    this.roles$.subscribe(roles => {
      this.roles = roles;
    });
  }

  trackById(_: number, role: RoleDto) {
    return role.id;
  }

  // Filtering and pagination methods
  get filteredRoles(): RoleDto[] {
    const term = this.searchTerm.trim().toLowerCase();
    
    // Apply text search filter
    let filtered = !term ? this.roles : this.roles.filter(role =>
      (role.name?.toLowerCase().includes(term) || false) ||
      (role.permissions?.some(permission => 
        permission.name?.toLowerCase().includes(term)
      ) || false)
    );
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }
  
  get totalFilteredRoles(): number {
    const term = this.searchTerm.trim().toLowerCase();
    
    if (!term) return this.roles.length;
    
    return this.roles.filter(role =>
      (role.name?.toLowerCase().includes(term) || false) ||
      (role.permissions?.some(permission => 
        permission.name?.toLowerCase().includes(term)
      ) || false)
    ).length;
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalFilteredRoles / this.pageSize);
  }
  
  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalFilteredRoles);
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  onSearchChange(): void {
    // Reset to first page when search term changes
    this.currentPage = 1;
  }

  handleAddRole() {
    this.roleDialogData.set({ isPermissionsOnly: false });
    this.showRoleDialog.set(true);
  }

  handleEditRole(role: RoleDto) {
    this.roleDialogData.set({ 
      isPermissionsOnly: false,
      role: role
    });
    this.showRoleDialog.set(true);
  }

  handleManagePermissions(role: RoleDto) {
    this.roleDialogData.set({ 
      isPermissionsOnly: true,
      role: role
    });
    this.showRoleDialog.set(true);
  }

  onRoleDialogClose() {
    this.showRoleDialog.set(false);
  }

  onRoleDialogSave(result: RoleDialogResult) {
    const dialogData = this.roleDialogData();
    
    if (dialogData.isPermissionsOnly) {
      // Just updating permissions
      if (dialogData.role?.id) {
        this.rolesFacade.updatePermissions(
          dialogData.role.id,
          result.permissions
        );
        this.snackBar.open(`Permisos de ${dialogData.role.name} actualizados correctamente`, 'Cerrar', {
          duration: 3000
        });
      }
    } else if (dialogData.role?.id && result.name) {
      // Editing existing role name only
      this.rolesFacade.updateRoleApi({ 
        id: dialogData.role.id,
        name: result.name
      });
      this.snackBar.open(`Rol ${result.name} actualizado correctamente`, 'Cerrar', {
        duration: 3000
      });
    } else if (result.name) {
      // Creating new role with name and permissions
      this.rolesFacade.createRole({ 
        name: result.name, 
        permissions: result.permissions 
      });
      this.snackBar.open(`Rol ${result.name} creado correctamente`, 'Cerrar', {
        duration: 3000
      });
    }
    
    this.showRoleDialog.set(false);
  }

  handleDeleteRole(role: RoleDto) {
    // Protección especial para el rol admin
    if (role.name?.toLowerCase() === 'admin' || role.name?.toLowerCase() === 'administrador') {
      this.snackBar.open(
        'No se puede eliminar el rol de administrador por razones de seguridad', 
        'Cerrar', 
        { 
          duration: 5000,
          panelClass: ['error-snackbar']
        }
      );
      return;
    }

    // Mostrar diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && role.id) {
        this.rolesFacade.deleteRole(role.id);
        this.snackBar.open(
          `Rol "${role.name}" eliminado correctamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
      }
    });
  }
  
  // Helper method to check if a role can be deleted
  canDeleteRole(role: RoleDto): boolean {
    // Protect admin roles from deletion
    const adminRoleNames = ['admin', 'administrador', 'administrator', 'root', 'superuser'];
    return !adminRoleNames.includes(role.name?.toLowerCase() || '');
  }
  
  // Filter methods  
  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const filterContainer = target.closest('.filter-container');
    
    if (!filterContainer) {
      this.showFilterDropdown = false;
    }
  }
}
