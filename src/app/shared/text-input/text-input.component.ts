import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, MatIconModule],
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
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  name = input<string>();
  autocomplete = input<string>();
  required = input<boolean>(false);
  errorMessage = input<string>();
  icon = input<string>();
  hint = input<string>();
  maxlength = input<number>();

  value = '';
  touched = false;
  isDisabled = false;
  showPassword = false;

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get actualType(): string {
    if (this.type() === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type();
  }

  // CSS classes for styling
  get wrapperClasses(): string {
    let classes = 'input-wrapper';
    if (this.currentErrorMessage && this.touched) {
      classes += ' error';
    }
    if (this.isDisabled) {
      classes += ' disabled';
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
