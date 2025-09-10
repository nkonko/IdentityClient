import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolesFacade } from '../../../../core/facades/roles.facade';
import { PermissionDto, RoleDto } from '../../../../core/api/api-client';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../shared/button/button.component';

export interface RoleDialogData {
  isEditMode: boolean;
  role: RoleDto;
}

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ButtonComponent,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
})
export class RoleDialogComponent implements OnInit {
  private readonly rolesFacade = inject(RolesFacade);
  public data: RoleDialogData = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<RoleDialogComponent>);

  availablePermissions$: Observable<PermissionDto[]> = this.rolesFacade.permissions$;

  ngOnInit() {
    if (this.data.isEditMode && !this.data.role.permissions) {
      this.rolesFacade.loadPermissions(this.data.role.id!);
    }
  }

  isPermissionSelected(permission: PermissionDto): boolean {
    return this.data.role.permissions?.some(p => p.name === permission.name) ?? false;
  }

  togglePermission(permission: PermissionDto, event: any) {
    if (!this.data.role.permissions) {
      this.data.role.permissions = [];
    }

    if (event.checked) {
      this.data.role.permissions.push(permission);
    } else {
      const index = this.data.role.permissions.findIndex(p => p.name === permission.name);
      if (index > -1) {
        this.data.role.permissions.splice(index, 1);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

