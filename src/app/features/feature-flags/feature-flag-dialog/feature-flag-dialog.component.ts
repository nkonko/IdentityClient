import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FeatureFlagDialogData, FeatureFlagDialogResult } from '../models/feature-flag-dialog.model';

@Component({
  selector: 'app-feature-flag-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSlideToggleModule,
    ModalComponent,
    ButtonComponent,
  ],
  templateUrl: './feature-flag-dialog.component.html',
  styleUrls: ['./feature-flag-dialog.component.scss'],
})
export class FeatureFlagDialogComponent {
  // Signal inputs
  isOpen = input(false);
  data = input<FeatureFlagDialogData>({ mode: 'create' });

  // Signal outputs
  close = output<void>();
  save = output<FeatureFlagDialogResult>();

  private readonly fb = new FormBuilder();

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    isEnabled: [false],
  });

  isSaving = signal(false);
  private wasOpen = false;

  // Computed signals
  isEditMode = computed(() => this.data().mode === 'edit');
  dialogTitle = computed(() => this.isEditMode() ? 'Edit Feature Flag' : 'Create Feature Flag');

  constructor() {
    effect(() => {
      const currentData = this.data();
      const open = this.isOpen();

      // Only initialize form when dialog opens (transition from closed to open)
      if (open && !this.wasOpen) {
        this.initForm(currentData);
      }
      this.wasOpen = open;
    });
  }

  private initForm(currentData: FeatureFlagDialogData): void {
    this.isSaving.set(false);

    if (currentData.mode === 'edit' && currentData.featureFlag) {
      this.form.patchValue({
        name: currentData.featureFlag.name,
        description: currentData.featureFlag.description || '',
        isEnabled: currentData.featureFlag.isEnabled,
      });
      // Disable name field in edit mode
      this.form.get('name')?.disable();
    } else {
      this.form.reset({
        name: '',
        description: '',
        isEnabled: false,
      });
      this.form.get('name')?.enable();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    const currentData = this.data();
    const result: FeatureFlagDialogResult = {
      name: this.form.get('name')?.value || currentData.featureFlag?.name || '',
      description: this.form.get('description')?.value || undefined,
      isEnabled: this.form.get('isEnabled')?.value || false,
    };

    this.save.emit(result);
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;

    return '';
  }
}
