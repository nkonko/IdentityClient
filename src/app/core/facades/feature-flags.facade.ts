import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DashboardClient,
  FeatureFlagCreateDto,
  FeatureFlagDto,
  FeatureFlagToggleDto,
  FeatureFlagUpdateDto,
} from '../api';
import {
  FeatureFlag,
  FeatureFlagCreate,
  FeatureFlagState,
  FeatureFlagUpdate,
} from '../models';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsFacade {
  private readonly client = inject(DashboardClient);

  /**
   * Get all feature flags (Admin only - full details)
   */
  getAll(): Observable<FeatureFlag[]> {
    return this.client.featureFlagsAll().pipe(
      map(dtos => dtos.map(dto => this.mapToFeatureFlag(dto)))
    );
  }

  /**
   * Get all feature flag states (simplified for clients)
   */
  getAllStates(): Observable<FeatureFlagState[]> {
    return this.client.states().pipe(
      map(dtos => dtos.map(dto => ({
        name: dto.name ?? '',
        isEnabled: dto.isEnabled ?? false,
      })))
    );
  }

  /**
   * Get a feature flag by ID
   */
  getById(id: number): Observable<FeatureFlag> {
    return this.client.featureFlagsGET(id).pipe(
      map(dto => this.mapToFeatureFlag(dto))
    );
  }

  /**
   * Get a feature flag by name
   */
  getByName(name: string): Observable<FeatureFlag> {
    return this.client.byName(name).pipe(
      map(dto => this.mapToFeatureFlag(dto))
    );
  }

  /**
   * Check if a specific feature is enabled
   */
  isEnabled(name: string): Observable<boolean> {
    return this.client.check(name);
  }

  /**
   * Create a new feature flag
   */
  create(featureFlag: FeatureFlagCreate): Observable<FeatureFlag> {
    const dto = new FeatureFlagCreateDto();
    dto.name = featureFlag.name;
    dto.description = featureFlag.description;
    dto.isEnabled = featureFlag.isEnabled;

    return this.client.featureFlagsPOST(dto).pipe(
      map(result => this.mapToFeatureFlag(result))
    );
  }

  /**
   * Update a feature flag
   */
  update(id: number, featureFlag: FeatureFlagUpdate): Observable<FeatureFlag> {
    const dto = new FeatureFlagUpdateDto();
    dto.description = featureFlag.description;
    dto.isEnabled = featureFlag.isEnabled;

    return this.client.featureFlagsPUT(id, dto).pipe(
      map(result => this.mapToFeatureFlag(result))
    );
  }

  /**
   * Toggle a feature flag on/off
   */
  toggle(id: number, isEnabled: boolean): Observable<FeatureFlag> {
    const dto = new FeatureFlagToggleDto();
    dto.isEnabled = isEnabled;

    return this.client.toggle(id, dto).pipe(
      map(result => this.mapToFeatureFlag(result))
    );
  }

  /**
   * Delete a feature flag
   */
  delete(id: number): Observable<void> {
    return this.client.featureFlagsDELETE(id);
  }

  /**
   * Map DTO to domain model
   */
  private mapToFeatureFlag(dto: FeatureFlagDto): FeatureFlag {
    return {
      id: dto.id ?? 0,
      name: dto.name ?? '',
      description: dto.description ?? undefined,
      isEnabled: dto.isEnabled ?? false,
      createdAt: dto.createdAt ?? new Date(),
      updatedAt: dto.updatedAt ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
    };
  }
}
