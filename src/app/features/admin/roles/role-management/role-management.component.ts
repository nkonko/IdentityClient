import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesFacade } from '../../../../core/facades/roles.facade';
import { RoleDto } from '../../../../core/api/api-client';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../../../shared/section-title/section-title.component';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'app-role-management',
  imports: [CommonModule, FormsModule, MatIconModule, SectionTitleComponent, ButtonComponent],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  private readonly rolesFacade = inject(RolesFacade);
  private readonly dialog = inject(MatDialog);

  roles$: Observable<RoleDto[]> = this.rolesFacade.roles$;
  loading$: Observable<boolean> = this.rolesFacade.loading$;
  searchTerm = '';

  ngOnInit() {
    this.rolesFacade.loadRoles();
  }

  trackById(_: number, role: RoleDto) {
    return role.id;
  }

  handleAddRole() {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '500px',
      data: { isEditMode: false, role: { name: '', permissions: [] } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesFacade.createRole(result);
      }
    });
  }

  handleEditRole(role: RoleDto) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '500px',
      data: { isEditMode: true, role: { ...role } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesFacade.updateRole(result);
      }
    });
  }

  handleManagePermissions(role: RoleDto) {
    // To be implemented
  }

  handleDeleteRole(roleId: string) {
    this.rolesFacade.deleteRole(roleId);
  }
}
