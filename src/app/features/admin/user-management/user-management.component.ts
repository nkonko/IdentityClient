import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserRow } from './models/user-row';
import { UserFacade } from '../../../core/facades/user.facade';
import { map } from 'rxjs';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SectionTitleComponent } from '../../../shared/section-title/section-title.component';



@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, ButtonComponent, SectionTitleComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  showModal = false;
  editingUser: UserRow | null = null;
  searchTerm = '';
  users: UserRow[] = [];

  private readonly userFacade = inject(UserFacade);

  ngOnInit(): void {
      this.userFacade.getUsers().pipe(
        map(users => users.map((u): UserRow => ({
          id: u.id,
          name: u.name,
          email: u.email,
          roles: u.roles,
          status: u.status ? 'Active' : 'Inactive',
          lastLogin: u.lastLogin?.toLocaleDateString()
        })))
      )
  }

  get filteredUsers(): UserRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.users;
    return this.users.filter(u =>
      u.name!.toLowerCase().includes(term) ||
      u.email!.toLowerCase().includes(term) ||
      u.roles?.includes(term) ||
      u.status.toLowerCase().includes(term)
    );
  }

  trackById = (_: number, row: UserRow) => row.id;

  handleAddUser() {
    this.editingUser = null;
    this.showModal = true;
  }

  handleEditUser(user: UserRow) {
    this.editingUser = { ...user };
    this.showModal = true;
  }

  handleCloseModal() {
    this.showModal = false;
    this.editingUser = null;
  }

  getStatusClass(status: UserRow['status']): string {
    switch (status) {
      case 'Active': return 'badge status status-active';
      case 'Inactive': return 'badge status status-inactive';
      case 'Blocked': return 'badge status status-pending';
      default: return 'badge status';
    }
  }

  // getRoleClass(role: UserRow['roles']): string {
  //   switch (role) {
  //     case 'Admin': return 'badge role role-admin';
  //     case 'Editor': return 'badge role role-editor';
  //     case 'Viewer': return 'badge role role-viewer';
  //     default: return 'badge role';
  //   }
  // }
}
