import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export interface NotificationPreferences {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  emailSecurityAlerts: boolean;
  emailAccountActivity: boolean;
  emailSystemUpdates: boolean;
  inAppRealTimeAlerts: boolean;
  inAppSystemMessages: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationsComponent),
      multi: true
    }
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, ControlValueAccessor {
  @Input() isLoading = false;

  notificationsForm: FormGroup;
  private onChange: (value: NotificationPreferences) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    this.notificationsForm = this.fb.group({
      // Main switches
      emailNotifications: [false],
      inAppNotifications: [true],
      
      // Email sub-options
      emailSecurityAlerts: [true],
      emailAccountActivity: [false],
      emailSystemUpdates: [false],
      
      // In-app sub-options
      inAppRealTimeAlerts: [true],
      inAppSystemMessages: [true]
    });
  }

  ngOnInit() {
    // Subscribe to form changes to notify parent component
    this.notificationsForm.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });

    // Auto-disable sub-options when main switches are off
    this.notificationsForm.get('emailNotifications')?.valueChanges.subscribe(enabled => {
      if (!enabled) {
        this.notificationsForm.patchValue({
          emailSecurityAlerts: false,
          emailAccountActivity: false,
          emailSystemUpdates: false
        }, { emitEvent: false });
      }
    });

    this.notificationsForm.get('inAppNotifications')?.valueChanges.subscribe(enabled => {
      if (!enabled) {
        this.notificationsForm.patchValue({
          inAppRealTimeAlerts: false,
          inAppSystemMessages: false
        }, { emitEvent: false });
      }
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: NotificationPreferences): void {
    if (value) {
      this.notificationsForm.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: NotificationPreferences) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.notificationsForm.disable();
    } else {
      this.notificationsForm.enable();
    }
  }

  get formValue(): NotificationPreferences {
    return this.notificationsForm.value;
  }

  get hasUnsavedChanges(): boolean {
    return this.notificationsForm.dirty && this.notificationsForm.valid;
  }

  // Method to save preferences (called by parent component)
  async saveNotificationPreferences(): Promise<void> {
    if (this.notificationsForm.valid) {
      const preferences = this.notificationsForm.value as NotificationPreferences;
      
      // TODO: Implement API call to save notification preferences
      // await this.notificationService.savePreferences(preferences);
      console.log('Saving notification preferences:', preferences);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark form as pristine after successful save
      this.notificationsForm.markAsPristine();
    }
  }
}
