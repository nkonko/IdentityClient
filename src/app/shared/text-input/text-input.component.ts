import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input({ required: true }) control!: FormControl;

  // Derived UI state
  get showError(): boolean {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (!errors) return '';

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Formato de correo inválido';
    if (errors['minlength']) {
      const req = errors['minlength'].requiredLength;
      return `Debe tener al menos ${req} caracteres`;
    }
    if (errors['maxlength']) {
      const req = errors['maxlength'].requiredLength;
      return `Debe tener como máximo ${req} caracteres`;
    }
    if (errors['pattern']) return 'El formato no es válido';

    // Fallback: first error key as string
    const firstKey = Object.keys(errors)[0];
    return typeof errors[firstKey] === 'string' ? errors[firstKey] : 'Valor inválido';
  }

  onInput(value: string) {
    this.control?.setValue(value);
    if (!this.control?.dirty) this.control.markAsDirty();
  }

  onBlur() {
    this.control?.markAsTouched();
  }
}
