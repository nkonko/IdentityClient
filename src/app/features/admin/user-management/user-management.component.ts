import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRow } from './models/user-row';
import { UserFacade } from '../../../core/facades/user.facade';
import { LoggingService } from '../../../core/services/logging.service';
import { map } from 'rxjs';
import { SectionTitleComponent } from '../../../shared/section-title/section-title.component';



@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSnackBarModule,
    SectionTitleComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  searchTerm = '';
  users: UserRow[] = [];
  
  // Filter properties
  statusFilter: 'All' | 'Active' | 'Inactive' | 'Blocked' = 'All';
  showFilterDropdown = false;
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  
  private readonly userFacade = inject(UserFacade);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.userFacade.getUsers().pipe(
      map(users => users.map((u): UserRow => ({
        id: u.id,
        name: u.name,
        email: u.email,
        roles: u.roles,
        status: (u.status as 'Active' | 'Inactive' | 'Blocked') ?? 'Inactive',
        lastLogin: u.lastLogin?.toLocaleDateString()
      })))
    ).subscribe(users => this.users = users);
  }

  get filteredUsers(): UserRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    
    // Apply text search filter
    let filtered = !term ? this.users : this.users.filter(u =>
      (u.name?.toLowerCase().includes(term) || false) ||
      (u.email?.toLowerCase().includes(term) || false) ||
      (u.roles?.some(role => role.toLowerCase().includes(term)) || false) ||
      u.status.toLowerCase().includes(term)
    );
    
    // Apply status filter
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(u => u.status === this.statusFilter);
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }
  
  get totalFilteredUsers(): number {
    const term = this.searchTerm.trim().toLowerCase();
    
    // Apply text search filter
    let filtered = !term ? this.users : this.users.filter(u =>
      (u.name?.toLowerCase().includes(term) || false) ||
      (u.email?.toLowerCase().includes(term) || false) ||
      (u.roles?.some(role => role.toLowerCase().includes(term)) || false) ||
      u.status.toLowerCase().includes(term)
    );
    
    // Apply status filter
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(u => u.status === this.statusFilter);
    }
    
    return filtered.length;
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalFilteredUsers / this.pageSize);
  }
  
  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalFilteredUsers);
  }

  trackById = (_: number, row: UserRow) => row.id;

  // User status management methods
  activateUser(user: UserRow): void {
    if (!user.id) return;
    
    this.userFacade.activateUser(user.id).subscribe({
      next: () => {
        user.status = 'Active';
        this.snackBar.open(`User ${user.name} activated successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to activate user', 'Close', { duration: 3000 });
        console.error('Error activating user:', error);
      }
    });
  }
  
  deactivateUser(user: UserRow): void {
    if (!user.id) return;
    
    this.userFacade.deactivateUser(user.id).subscribe({
      next: () => {
        user.status = 'Inactive';
        this.snackBar.open(`User ${user.name} deactivated successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to deactivate user', 'Close', { duration: 3000 });
        console.error('Error deactivating user:', error);
      }
    });
  }
  
  blockUser(user: UserRow): void {
    if (!user.id) return;
    
    this.userFacade.blockUser(user.id).subscribe({
      next: () => {
        user.status = 'Blocked';
        this.snackBar.open(`User ${user.name} blocked successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to block user', 'Close', { duration: 3000 });
        console.error('Error blocking user:', error);
      }
    });
  }
  
  deleteUser(user: UserRow): void {
    if (!user.id) return;
    
    this.userFacade.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.snackBar.open(`User ${user.name} deleted successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
        console.error('Error deleting user:', error);
      }
    });
  }

  getStatusClass(status: UserRow['status']): string {
    switch (status) {
      case 'Active': return 'badge status status-active';
      case 'Inactive': return 'badge status status-inactive';
      case 'Blocked': return 'badge status status-pending';
      default: return 'badge status';
    }
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
  
  // Filter methods
  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }
  
  selectStatusFilter(status: 'All' | 'Active' | 'Inactive' | 'Blocked'): void {
    this.statusFilter = status;
    this.showFilterDropdown = false;
    this.currentPage = 1; // Reset to first page when filter changes
  }
  
  get activeFilterCount(): number {
    return this.statusFilter === 'All' ? 0 : 1;
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
