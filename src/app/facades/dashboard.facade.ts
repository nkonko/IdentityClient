import { Injectable, inject } from '@angular/core';
import { IdentityClient, DashboardSummaryDto, DashboardMetricsDto, DashboardRecentDto, DashboardNotificationDto } from '../api/api-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly client = inject(IdentityClient);

  summary(): Observable<DashboardSummaryDto> { return this.client.summary(); }
  metrics(): Observable<DashboardMetricsDto> { return this.client.metrics(); }
  recent(): Observable<DashboardRecentDto> { return this.client.recent(); }
  notifications(): Observable<DashboardNotificationDto[]> { return this.client.notifications(); }
}
