import { Component, input, OnInit, OnDestroy, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ValidationErrorService } from './validation-error.service';

@Component({
  selector: 'app-form-text-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="ud-field">
      <label class="ud-label" [attr.for]="name()">
        {{ label() }}
        @if (required()) {
          <span class="ud-label--required">*</span>
        }
      </label>
      
      <input
        [id]="name()"
        [ngClass]="inputClasses"
        [attr.type]="type()"
        [attr.name]="name() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.placeholder]="placeholder() || null"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      
      @if (showError) {
        <div class="ud-error">{{ currentErrorMessage }}</div>
      }
    </div>
  `,
  styleUrls: ['./text-input.component.scss']
})
export class FormTextInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password'>('text');
  name = input<string>();
  autocomplete = input<string>();
  required = input<boolean>(false);

  private readonly validationService = inject(ValidationErrorService);
  private readonly destroy$ = new Subject<void>();
  
  value = '';
  touched = false;
  isDisabled = false;
  currentErrorMessage = '';
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  get showError(): boolean {
    return !!(this.currentErrorMessage && this.touched);
  }
}