import { Component, input, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { ValidationErrorService } from '../text-input/validation-error.service';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  rows = input<number>(4);
  name = input<string>();
  required = input<boolean>(false);
  // Usar isDisabled en lugar de disabled para evitar el warning de Angular
  // cuando se usa con reactive forms
  isDisabled = input<boolean>(false);
  control = input<FormControl>(); // For backward compatibility
  errorMessage = input<string>();

  private readonly validationService = inject(ValidationErrorService);

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
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  // CSS classes for styling
  get textareaClasses(): string {
    let classes = 'ud-textarea';
    if (this.currentErrorMessage && this.touched) {
      classes += ' ud-textarea--error';
    }
    // Solo aplicar isDisabled para ControlValueAccessor mode
    if (!this.control() && this.isDisabled()) {
      classes += ' ud-textarea--disabled';
    }
    // Para control mode, el FormControl maneja su propio estado disabled
    if (this.control() && this.control()!.disabled) {
      classes += ' ud-textarea--disabled';
    }
    return classes;
  }

  get currentErrorMessage(): string {
    // Use provided errorMessage or derive from control if available
    if (this.errorMessage()) return this.errorMessage()!;
    
    const control = this.control();
    if (control) {
      const shouldShowError = control.invalid && (control.dirty || control.touched);
      return shouldShowError ? this.validationService.getErrorMessage(control.errors) : '';
    }
    
    return '';
  }

  get showError(): boolean {
    return !!(this.currentErrorMessage && this.touched);
  }
}
