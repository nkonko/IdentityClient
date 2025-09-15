import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatSlideToggleModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  private fb = inject(FormBuilder);
  
  isSaving = false;
  
  notificationsForm = this.fb.group({
    accountActivity: [true],
    securityAlerts: [true],
    productUpdates: [true],
    promotionalOffers: [false]
  });
  
  savePreferences() {
    if (this.notificationsForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.notificationsForm.markAsPristine();
      // Show success message
      console.log('Preferences saved', this.notificationsForm.value);
    }, 1000);
  }
  
  // TODO: Implement save functionality when API is available
  // For now, this is just a UI mockup
}
