import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoDirective } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { SettingsDto, SettingsUpdateDto } from '../../core/api/api-client';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { selectSettings, selectIsLoading } from '../../core/store/settings/settings.selectors';
import { updateSettings } from '../../core/store/settings/settings.actions';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    TranslocoDirective,
    SectionTitleComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  protected isSaving = signal(false);
  protected currentSettings = signal<SettingsDto | null>(null);

  // Store selectors
  protected settings$ = this.store.select(selectSettings);
  protected isLoading$ = this.store.select(selectIsLoading);

  // Form group
  protected settingsForm: FormGroup;

  constructor() {
    this.settingsForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      supportEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]]
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  protected loadSettings() {
    this.settings$.subscribe({
      next: (settings) => {
        if (settings) {
          this.currentSettings.set(settings);
          this.settingsForm.patchValue({
            companyName: settings.companyName || '',
            supportEmail: settings.supportEmail || ''
          });
        }
      }
    });
  }

  protected saveSettings() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.snackBar.open('Por favor corrija los errores en el formulario', 'Cerrar', { 
        duration: 5000,
        panelClass: ['warn-snackbar']
      });
      return;
    }

    this.isSaving.set(true);
    const formValue = this.settingsForm.value;
    const updateDto = new SettingsUpdateDto({
      companyName: formValue.companyName?.trim(),
      supportEmail: formValue.supportEmail?.trim()
    });

    // Dispatch action to update settings
    this.store.dispatch(updateSettings({ settings: updateDto as SettingsDto }));
    
    this.snackBar.open('Configuraciones guardadas correctamente', 'Cerrar', { 
      duration: 5000,
      panelClass: ['success-snackbar']
    });
    this.isSaving.set(false);
    this.settingsForm.markAsPristine();
  }

  protected resetForm() {
    const current = this.currentSettings();
    if (current) {
      this.settingsForm.patchValue({
        companyName: current.companyName || '',
        supportEmail: current.supportEmail || ''
      });
      this.settingsForm.markAsUntouched();
      this.settingsForm.markAsPristine();
    }
  }

  protected getFieldErrorMessage(fieldName: string): string {
    const field = this.settingsForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['email']) {
        return 'Ingrese un correo electrónico válido';
      }
      if (field.errors['minlength']) {
        return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `No puede tener más de ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  protected get hasUnsavedChanges(): boolean {
    return this.settingsForm.dirty && this.settingsForm.valid;
  }

  protected get canSave(): boolean {
    return this.settingsForm.valid && this.settingsForm.dirty && !this.isSaving();
  }
}