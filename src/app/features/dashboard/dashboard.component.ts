import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DashboardFacade } from '../../core/facades/dashboard.facade';
import { DashboardSummaryDto, DashboardMetricsDto, DashboardRecentDto, DashboardNotificationDto } from '../../core/api/api-client';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    SectionTitleComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly dashboardFacade = inject(DashboardFacade);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected summary: DashboardSummaryDto | null = null;
  protected metrics: DashboardMetricsDto | null = null;
  protected recent: DashboardRecentDto | null = null;
  protected notifications: DashboardNotificationDto[] = [];

  protected isLoading = {
    summary: false,
    metrics: false,
    recent: false,
    notifications: false
  };

  // Derived metric for the 4th card
  get recentLoginsCount(): number {
    return this.recent?.recentActivities?.length ?? 0;
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loadSummary();
    this.loadMetrics();
    this.loadRecent();
    this.loadNotifications();
  }

  loadSummary() {
    this.isLoading.summary = true;
    this.dashboardFacade.summary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading.summary = false;
      },
      error: () => {
        this.isLoading.summary = false;
        this.snackBar.open('Error al cargar el resumen', 'Cerrar', { duration: 5000 });
      }
    });
  }

  loadMetrics() {
    this.isLoading.metrics = true;
    this.dashboardFacade.metrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.isLoading.metrics = false;
      },
      error: () => {
        this.isLoading.metrics = false;
        this.snackBar.open('Error al cargar las métricas', 'Cerrar', { duration: 5000 });
      }
    });
  }

  loadRecent() {
    this.isLoading.recent = true;
    this.dashboardFacade.recent().subscribe({
      next: (data) => {
        this.recent = data;
        this.isLoading.recent = false;
      },
      error: () => {
        this.isLoading.recent = false;
        this.snackBar.open('Error al cargar las actividades recientes', 'Cerrar', { duration: 5000 });
      }
    });
  }

  loadNotifications() {
    this.isLoading.notifications = true;
    this.dashboardFacade.notifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading.notifications = false;
      },
      error: () => {
        this.isLoading.notifications = false;
        this.snackBar.open('Error al cargar las notificaciones', 'Cerrar', { duration: 5000 });
      }
    });
  }

  getNotificationIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type?.toLowerCase()) {
      case 'success': return 'accent';
      case 'warning': return 'warn';
      case 'error': return 'warn';
      case 'info': return 'primary';
      default: return 'primary';
    }
  }
}
