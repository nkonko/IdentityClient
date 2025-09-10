import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesFacade } from '../../../../core/facades/roles.facade';
import { PermissionDto, RoleDto } from '../../../../core/api/api-client';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    ButtonComponent,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
})
export class RoleDialogComponent implements OnInit {
  private readonly rolesFacade = inject(RolesFacade);

  @Input() isEditMode: boolean = false;
  @Input() role!: RoleDto;

  @Output() save = new EventEmitter<RoleDto>();
  @Output() cancel = new EventEmitter<void>();

  availablePermissions$: Observable<PermissionDto[]> = this.rolesFacade.permissions$;

  ngOnInit() {
    if (this.isEditMode && !this.role.permissions) {
      this.rolesFacade.loadPermissions(this.role.id!);
    }
  }

  isPermissionSelected(permission: PermissionDto): boolean {
    return this.role.permissions?.some(p => p.name === permission.name) ?? false;
  }

  togglePermission(permission: PermissionDto, event: any) {
    if (!this.role.permissions) {
      this.role.permissions = [];
    }

    if (event.checked) {
      this.role.permissions.push(permission);
    } else {
      const index = this.role.permissions.findIndex(p => p.name === permission.name);
      if (index > -1) {
        this.role.permissions.splice(index, 1);
      }
    }
  }

  onSave(): void {
    this.save.emit(this.role);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

