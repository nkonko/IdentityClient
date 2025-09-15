import { Component, Input, forwardRef, inject } from '@angular/core';
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
  @Input() label = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() name?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() control?: FormControl; // For backward compatibility
  @Input() errorMessage?: string;

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
    this.disabled = isDisabled;
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
    if (this.disabled) {
      classes += ' ud-textarea--disabled';
    }
    return classes;
  }

  get currentErrorMessage(): string {
    // Use provided errorMessage or derive from control if available
    if (this.errorMessage) return this.errorMessage;
    
    if (this.control) {
      const shouldShowError = this.control.invalid && (this.control.dirty || this.control.touched);
      return shouldShowError ? this.validationService.getErrorMessage(this.control.errors) : '';
    }
    
    return '';
  }

  get showError(): boolean {
    return !!(this.currentErrorMessage && this.touched);
  }
}
