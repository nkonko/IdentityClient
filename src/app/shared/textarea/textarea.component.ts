import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
    if (this.isDisabled) {
      classes += ' ud-textarea--disabled';
    }
    return classes;
  }

  get currentErrorMessage(): string {
    // Use provided errorMessage
    if (this.errorMessage()) return this.errorMessage()!;
    
    return '';
  }

  get showError(): boolean {
    return !!(this.currentErrorMessage && this.touched);
  }
}
