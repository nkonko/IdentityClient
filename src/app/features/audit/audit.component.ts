import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuditFacade } from '../../core/facades/audit.facade';
import { AuditLogDto } from '../../core/api/api-client';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    TranslocoDirective,
    SectionTitleComponent
  ],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss'
})
export class AuditComponent implements OnInit {
  private readonly auditFacade = inject(AuditFacade);
  private readonly snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  protected allLogs = signal<AuditLogDto[]>([]);
  protected isLoading = signal(false);
  protected totalCount = signal(0);
  protected pageIndex = signal(0);
  protected pageSize = signal(10);
  protected sortBy = signal('date');
  protected sortDirection = signal<'asc' | 'desc'>('desc');

  // Filter controls
  protected searchControl = new FormControl('');
  protected actionFilter = new FormControl('');
  protected userIdFilter = new FormControl('');
  protected dateFromFilter = new FormControl<Date | null>(null);
  protected dateToFilter = new FormControl<Date | null>(null);

  // Table configuration
  protected displayedColumns = ['date', 'userId', 'action', 'id'];

  // Computed filtered and sorted data
  protected filteredLogs = computed(() => {
    let logs = [...this.allLogs()];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      logs = logs.filter(log => 
        log.action?.toLowerCase().includes(searchTerm) ||
        log.userId?.toLowerCase().includes(searchTerm) ||
        log.id?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply action filter
    const actionFilter = this.actionFilter.value;
    if (actionFilter) {
      logs = logs.filter(log => log.action === actionFilter);
    }

    // Apply user ID filter
    const userIdFilter = this.userIdFilter.value;
    if (userIdFilter) {
      logs = logs.filter(log => log.userId?.toLowerCase().includes(userIdFilter.toLowerCase()));
    }

    // Apply date range filter
    const dateFrom = this.dateFromFilter.value;
    const dateTo = this.dateToFilter.value;
    if (dateFrom || dateTo) {
      logs = logs.filter(log => {
        if (!log.date) return false;
        const logDate = new Date(log.date);
        
        if (dateFrom && logDate < dateFrom) return false;
        if (dateTo) {
          const endOfDay = new Date(dateTo);
          endOfDay.setHours(23, 59, 59, 999);
          if (logDate > endOfDay) return false;
        }
        
        return true;
      });
    }

    // Sort
    const sortBy = this.sortBy();
    const sortDirection = this.sortDirection();
    logs.sort((a, b) => {
      let aValue: any = (a as any)[sortBy];
      let bValue: any = (b as any)[sortBy];

      if (sortBy === 'date') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.totalCount.set(logs.length);
    return logs;
  });

  // Paginated data
  protected paginatedLogs = computed(() => {
    const filtered = this.filteredLogs();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return filtered.slice(startIndex, endIndex);
  });

  // Unique actions for filter dropdown
  protected uniqueActions = computed(() => {
    const actions = this.allLogs()
      .map(log => log.action)
      .filter((action, index, arr) => action && arr.indexOf(action) === index)
      .sort();
    return actions;
  });

  ngOnInit() {
    this.loadAuditLogs();
  }

  protected loadAuditLogs() {
    this.isLoading.set(true);
    this.auditFacade.getLogs().subscribe({
      next: (logs) => {
        this.allLogs.set(logs || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.snackBar.open('Error al cargar los logs de auditoría', 'Cerrar', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading.set(false);
      }
    });
  }

  protected loadUserLogs() {
    const userId = this.userIdFilter.value?.trim();
    if (!userId) {
      this.loadAuditLogs();
      return;
    }

    this.isLoading.set(true);
    this.auditFacade.getLogsByUser(userId).subscribe({
      next: (logs) => {
        this.allLogs.set(logs || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user audit logs:', error);
        this.snackBar.open(`Error al cargar los logs para el usuario: ${userId}`, 'Cerrar', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading.set(false);
      }
    });
  }

  protected clearFilters() {
    this.searchControl.setValue('');
    this.actionFilter.setValue('');
    this.userIdFilter.setValue('');
    this.dateFromFilter.setValue(null);
    this.dateToFilter.setValue(null);
    this.pageIndex.set(0);
  }

  protected onSort(sort: Sort) {
    this.sortBy.set(sort.active);
    this.sortDirection.set(sort.direction as 'asc' | 'desc' || 'desc');
    this.pageIndex.set(0); // Reset to first page when sorting
  }

  protected onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected refresh() {
    this.loadAuditLogs();
  }

  protected getActionChipColor(action: string): string {
    const actionLower = action?.toLowerCase();
    
    if (actionLower?.includes('create') || actionLower?.includes('add')) return 'primary';
    if (actionLower?.includes('update') || actionLower?.includes('edit')) return 'accent';
    if (actionLower?.includes('delete') || actionLower?.includes('remove')) return 'warn';
    if (actionLower?.includes('login') || actionLower?.includes('signin')) return 'primary';
    if (actionLower?.includes('logout') || actionLower?.includes('signout')) return 'basic';
    
    return 'basic';
  }
}