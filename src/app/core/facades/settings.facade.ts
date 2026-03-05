import { Injectable, inject } from '@angular/core';
import { DashboardClient, SettingsUpdateDto } from '../api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Settings, SettingsUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly client = inject(DashboardClient);

  /**
   * Get current system settings
   */
  getSettings(): Observable<Settings> {
    return this.client.settingsGET().pipe(
      map(dto => ({
        companyName: dto.companyName ?? '',
        supportEmail: dto.supportEmail ?? '',
      }))
    );
  }

  /**
   * Update system settings
   */
  updateSettings(settings: SettingsUpdate): Observable<void> {
    const dto = new SettingsUpdateDto();
    dto.companyName = settings.companyName;
    dto.supportEmail = settings.supportEmail;
    return this.client.settingsPUT(dto);
  }
}
