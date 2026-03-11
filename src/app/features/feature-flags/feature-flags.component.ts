import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { FeatureFlagsFacade } from '../../core/facades/feature-flags.facade';
import { FeatureFlag, FeatureFlagCreate, FeatureFlagUpdate } from '../../core/models';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { FeatureFlagDialogComponent } from './feature-flag-dialog/feature-flag-dialog.component';
import { FeatureFlagDialogData, FeatureFlagDialogResult } from './models/feature-flag-dialog.model';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    SectionTitleComponent,
    ButtonComponent,
    FeatureFlagDialogComponent,
  ],
  templateUrl: './feature-flags.component.html',
  styleUrls: ['./feature-flags.component.scss']
})
export class FeatureFlagsComponent implements OnInit {
  private readonly facade = inject(FeatureFlagsFacade);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Data
  featureFlags = signal<FeatureFlag[]>([]);
  loading = signal(true);
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Dialog state
  showDialog = signal(false);
  dialogData = signal<FeatureFlagDialogData>({ mode: 'create' });

  ngOnInit(): void {
    this.loadFeatureFlags();
  }

  loadFeatureFlags(): void {
    this.loading.set(true);
    this.facade.getAll().subscribe({
      next: (flags) => {
        this.featureFlags.set(flags);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading feature flags:', err);
        this.snackBar.open('Error loading feature flags', 'Close', { duration: 5000 });
        this.loading.set(false);
      }
    });
  }

  // Filtering and Pagination
  get filteredFlags(): FeatureFlag[] {
    const term = this.searchTerm.trim().toLowerCase();
    let filtered = this.featureFlags();

    if (term) {
      filtered = filtered.filter(flag =>
        flag.name.toLowerCase().includes(term) ||
        (flag.description?.toLowerCase().includes(term) ?? false)
      );
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  get totalFilteredFlags(): number {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.featureFlags().length;

    return this.featureFlags().filter(flag =>
      flag.name.toLowerCase().includes(term) ||
      (flag.description?.toLowerCase().includes(term) ?? false)
    ).length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalFilteredFlags / this.pageSize);
  }

  get startItem(): number {
    return this.totalFilteredFlags === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalFilteredFlags);
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  trackById(_: number, flag: FeatureFlag): number {
    return flag.id;
  }

  // Toggle flag
  onToggleFlag(flag: FeatureFlag): void {
    const newState = !flag.isEnabled;
    this.facade.toggle(flag.id, newState).subscribe({
      next: (updated) => {
        this.featureFlags.update(flags =>
          flags.map(f => f.id === updated.id ? updated : f)
        );
        this.snackBar.open(
          `"${flag.name}" ${newState ? 'enabled' : 'disabled'}`,
          'Close',
          { duration: 3000 }
        );
      },
      error: (err) => {
        console.error('Error toggling flag:', err);
        const message = this.extractErrorMessage(err, 'Error toggling feature flag');
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  // Create flag
  handleAddFlag(): void {
    this.dialogData.set({ mode: 'create' });
    this.showDialog.set(true);
  }

  // Edit flag
  handleEditFlag(flag: FeatureFlag): void {
    this.dialogData.set({ mode: 'edit', featureFlag: flag });
    this.showDialog.set(true);
  }

  // Delete flag
  handleDeleteFlag(flag: FeatureFlag): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Feature Flag',
        message: `Are you sure you want to delete the flag "${flag.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.facade.delete(flag.id).subscribe({
          next: () => {
            this.featureFlags.update(flags => flags.filter(f => f.id !== flag.id));
            this.snackBar.open(`"${flag.name}" deleted`, 'Close', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error deleting flag:', err);
            const message = this.extractErrorMessage(err, 'Error deleting feature flag');
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  // Dialog handlers
  onDialogClose(): void {
    this.showDialog.set(false);
  }

  onDialogSave(result: FeatureFlagDialogResult): void {
    const data = this.dialogData();

    if (data.mode === 'create') {
      const createDto: FeatureFlagCreate = {
        name: result.name,
        description: result.description,
        isEnabled: result.isEnabled,
      };

      this.facade.create(createDto).subscribe({
        next: (created) => {
          this.featureFlags.update(flags => [...flags, created]);
          this.snackBar.open(`"${created.name}" created`, 'Close', { duration: 3000 });
          this.showDialog.set(false);
        },
        error: (err) => {
          console.error('Error creating flag:', err);
          const message = this.extractErrorMessage(err, 'Error creating feature flag');
          this.snackBar.open(message, 'Close', { duration: 5000 });
          this.showDialog.set(false);
        }
      });
    } else if (data.mode === 'edit' && data.featureFlag) {
      const updateDto: FeatureFlagUpdate = {
        description: result.description,
        isEnabled: result.isEnabled,
      };

      this.facade.update(data.featureFlag.id, updateDto).subscribe({
        next: (updated) => {
          this.featureFlags.update(flags =>
            flags.map(f => f.id === updated.id ? updated : f)
          );
          this.snackBar.open(`"${updated.name}" updated`, 'Close', { duration: 3000 });
          this.showDialog.set(false);
        },
        error: (err) => {
          console.error('Error updating flag:', err);
          const message = this.extractErrorMessage(err, 'Error updating feature flag');
          this.snackBar.open(message, 'Close', { duration: 5000 });
          this.showDialog.set(false);
        }
      });
    }
  }

  // Helper for date formatting
  formatDate(date: Date | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Helper to extract error message from API exception
  private extractErrorMessage(err: any, defaultMessage: string): string {
    if (err?.response) {
      try {
        const errorData = JSON.parse(err.response);
        if (errorData?.message) {
          return errorData.message;
        }
      } catch {
        // If parsing fails, return default
      }
    }
    return defaultMessage;
  }
}
