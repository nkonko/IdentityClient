import { Injectable, inject } from '@angular/core';
import { IdentityClient, SettingsDto, SettingsUpdateDto } from '../api/api-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly client = inject(IdentityClient);

  /**
   * Get current system settings
   */
  getSettings(): Observable<SettingsDto> {
    return this.client.settingsGET();
  }

  /**
   * Update system settings
   */
  updateSettings(settings: SettingsUpdateDto): Observable<void> {
    return this.client.settingsPUT(settings);
  }
}