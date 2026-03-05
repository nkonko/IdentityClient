import { Injectable, inject } from '@angular/core';
import { IdentityClient } from '../api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditLog } from '../models';

@Injectable({ providedIn: 'root' })
export class AuditFacade {
  private readonly client = inject(IdentityClient);

  /**
   * Get all audit logs
   */
  getLogs(): Observable<AuditLog[]> {
    return this.client.logs().pipe(
      map(dtos => dtos.map(dto => ({
        id: dto.id ?? '',
        userId: dto.userId ?? '',
        action: dto.action ?? '',
        date: dto.date ?? new Date(),
      })))
    );
  }

  /**
   * Get audit logs for a specific user
   */
  getLogsByUser(userId: string): Observable<AuditLog[]> {
    return this.client.logs2(userId).pipe(
      map(dtos => dtos.map(dto => ({
        id: dto.id ?? '',
        userId: dto.userId ?? '',
        action: dto.action ?? '',
        date: dto.date ?? new Date(),
      })))
    );
  }
}
