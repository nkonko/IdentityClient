import { Component, input, forwardRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements ControlValueAccessor {
  @ViewChild('picker') picker!: MatDatepicker<Date>;

  label = input<string>('');
  placeholder = input<string>('');
  required = input<boolean>(false);
  errorMessage = input<string>();
  hint = input<string>();
  minDate = input<Date>();
  maxDate = input<Date>();

  value: Date | null = null;
  touched = false;
  isDisabled = false;

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  openPicker(): void {
    if (!this.isDisabled && this.picker) {
      this.picker.open();
    }
  }

  writeValue(value: Date | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onDateChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  get wrapperClasses(): Record<string, boolean> {
    return {
      'input-wrapper': true,
      'error': this.touched && !!this.errorMessage(),
      'disabled': this.isDisabled
    };
  }

  get showError(): boolean {
    return this.touched && !!this.errorMessage();
  }
}
