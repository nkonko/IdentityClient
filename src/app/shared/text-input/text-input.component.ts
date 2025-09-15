import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password'>('text');
  name = input<string>();
  autocomplete = input<string>();
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  errorMessage = input<string>();
  formControl = input<FormControl>(); // Para uso directo con reactive forms

  value = '';
  touched = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Note: For signal inputs, we can't directly set the value from ControlValueAccessor
    // The parent component should handle this through the disabled input
  }

  // Event handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  // CSS classes for styling
  get inputClasses(): string {
    let classes = 'ud-input';
    if (this.currentErrorMessage && (this.touched || this.hasFormControlErrors)) {
      classes += ' ud-input--error';
    }
    if (this.disabled()) {
      classes += ' ud-input--disabled';
    }
    return classes;
  }

  get currentErrorMessage(): string {
    // Use provided errorMessage first
    if (this.errorMessage()) return this.errorMessage()!;
    
    // If using formControl directly, get errors from it
    if (this.formControl()) {
      return this.getFormControlError();
    }
    
    return '';
  }

  get hasFormControlErrors(): boolean {
    const formControl = this.formControl();
    return !!(formControl && formControl.invalid && (formControl.dirty || formControl.touched));
  }

  get showError(): boolean {
    return !!(this.currentErrorMessage && (this.touched || this.hasFormControlErrors));
  }

  private getFormControlError(): string {
    const formControl = this.formControl();
    if (!formControl || !formControl.errors) return '';
    
    const errors = formControl.errors;
    const shouldShowError = formControl.invalid && (formControl.dirty || formControl.touched);
    
    if (!shouldShowError) return '';

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Formato de correo inválido';
    if (errors['minlength']) {
      const required = errors['minlength'].requiredLength;
      const actual = errors['minlength'].actualLength;
      return `Debe tener al menos ${required} caracteres (actual: ${actual})`;
    }
    if (errors['maxlength']) {
      const required = errors['maxlength'].requiredLength;
      return `Debe tener como máximo ${required} caracteres`;
    }
    if (errors['pattern']) return 'El formato no es válido';
    
    // Fallback
    const firstErrorKey = Object.keys(errors)[0];
    return typeof errors[firstErrorKey] === 'string' ? errors[firstErrorKey] : 'Valor inválido';
  }
}
