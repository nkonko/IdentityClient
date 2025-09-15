import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesFacade } from '../../../../core/facades/roles.facade';
import { RoleDto } from '../../../../core/api/api-client';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SectionTitleComponent } from '../../../../shared/section-title/section-title.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatSnackBarModule,
    SectionTitleComponent, 
    ButtonComponent
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
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '600px',
      data: { isPermissionsOnly: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create new role
        this.rolesFacade.createRole({ 
          name: result.name, 
          permissions: result.permissions 
        });
        
        this.snackBar.open(`Rol ${result.name} creado correctamente`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  handleEditRole(role: RoleDto) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '600px',
      data: { 
        isPermissionsOnly: false,
        role: role
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && role.id) {
        // Update existing role
        this.rolesFacade.updateRole({ 
          ...result, 
          id: role.id 
        });
        
        this.snackBar.open(`Rol ${result.name} actualizado correctamente`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  handleManagePermissions(role: RoleDto) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '600px',
      data: { 
        isPermissionsOnly: true,
        role: role
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && role.id) {
        // Update role permissions
        this.rolesFacade.updatePermissions(
          role.id,
          result.permissions
        );
        
        this.snackBar.open(`Permisos de ${role.name} actualizados correctamente`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  handleDeleteRole(roleId: string) {
    this.rolesFacade.deleteRole(roleId);
    this.snackBar.open('Role deleted successfully', 'Close', { duration: 3000 });
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
