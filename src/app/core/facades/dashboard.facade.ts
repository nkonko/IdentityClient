import { Injectable, inject } from '@angular/core';
import { DashboardClient } from '../api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardSummary, DashboardMetrics, DashboardRecent, DashboardNotification } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly client = inject(DashboardClient);

  summary(): Observable<DashboardSummary> {
    return this.client.summary().pipe(
      map(dto => ({
        totalUsers: dto.totalUsers ?? 0,
        totalRoles: dto.totalRoles ?? 0,
        totalSubscriptions: dto.totalSubscriptions ?? 0,
      }))
    );
  }

  metrics(): Observable<DashboardMetrics> {
    return this.client.metrics().pipe(
      map(dto => ({
        activeUsers: dto.activeUsers ?? 0,
        newUsersThisMonth: dto.newUsersThisMonth ?? 0,
        revenueThisMonth: dto.revenueThisMonth ?? 0,
      }))
    );
  }

  recent(): Observable<DashboardRecent> {
    return this.client.recent().pipe(
      map(dto => ({
        recentActivities: dto.recentActivities ?? [],
      }))
    );
  }

  notifications(): Observable<DashboardNotification[]> {
    return this.client.notifications().pipe(
      map(dtos => dtos.map(dto => ({
        message: dto.message ?? '',
        date: dto.date ?? new Date(),
      })))
    );
  }
}
