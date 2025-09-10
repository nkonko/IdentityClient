import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesFacade } from '../../../../core/facades/roles.facade';
import { RoleDto } from '../../../../core/api/api-client';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../../../shared/section-title/section-title.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component'; // Keep this for now, will be projected

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SectionTitleComponent, ButtonComponent, ModalComponent, RoleDialogComponent],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  private readonly rolesFacade = inject(RolesFacade);

  roles$: Observable<RoleDto[]> = this.rolesFacade.roles$;
  loading$: Observable<boolean> = this.rolesFacade.loading$;
  searchTerm = '';

  showModal = false;
  editingRole: RoleDto | null = null;

  ngOnInit() {
    this.rolesFacade.loadRoles();
  }

  trackById(_: number, role: RoleDto) {
    return role.id;
  }

  handleAddRole() {
    this.editingRole = new RoleDto({ name: '', permissions: [] });
    this.showModal = true;
  }

  handleEditRole(role: RoleDto) {
    this.editingRole = new RoleDto(role);
    this.showModal = true;
  }

  handleCloseModal() {
    this.showModal = false;
    this.editingRole = null;
  }

  handleModalButtonClick(action: string): void {
    if (action === 'cancel') {
      this.handleCloseModal();
    } else if (action === 'save' && this.editingRole?.name) {
      if (this.editingRole) {
        if (this.editingRole.id) {
          this.rolesFacade.updateRole({ ...this.editingRole, id: this.editingRole.id, name: this.editingRole.name, permissions: this.editingRole.permissions?.map(p => p.name!) ?? [] });
        } else {
          this.rolesFacade.createRole({ name: this.editingRole.name, permissions: this.editingRole.permissions?.map(p => p.name!) ?? [] });
        }
      }
      this.handleCloseModal();
    }
  }

  handleManagePermissions(role: RoleDto) {
    // To be implemented
  }

  handleDeleteRole(roleId: string) {
    this.rolesFacade.deleteRole(roleId);
  }
}
