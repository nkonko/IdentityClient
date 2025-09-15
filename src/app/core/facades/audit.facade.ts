import { Injectable, inject } from '@angular/core';
import { IdentityClient, AuditLogDto } from '../api/api-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditFacade {
  private readonly client = inject(IdentityClient);

  /**
   * Get all audit logs
   */
  getLogs(): Observable<AuditLogDto[]> {
    return this.client.logs();
  }

  /**
   * Get audit logs for a specific user
   */
  getLogsByUser(userId: string): Observable<AuditLogDto[]> {
    return this.client.logs2(userId);
  }
}