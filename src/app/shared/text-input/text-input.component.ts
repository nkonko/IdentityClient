import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule],
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
  errorMessage = input<string>();

  value = '';
  touched = false;
  isDisabled = false;

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
    this.isDisabled = isDisabled;
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
    if (this.currentErrorMessage && this.touched) {
      classes += ' ud-input--error';
    }
    if (this.isDisabled) {
      classes += ' ud-input--disabled';
    }
    return classes;
  }

  get currentErrorMessage(): string {
    // Use provided errorMessage first
    if (this.errorMessage()) return this.errorMessage()!;
    
    return '';
  }

  get showError(): boolean {
    return !!(this.currentErrorMessage && this.touched);
  }
}
