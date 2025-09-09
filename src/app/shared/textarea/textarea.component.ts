import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input({ required: true }) control!: FormControl;

  get showError(): boolean {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    if (!errors) return '';

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) {
      const req = errors['minlength'].requiredLength;
      return `Debe tener al menos ${req} caracteres`;
    }
    if (errors['maxlength']) {
      const req = errors['maxlength'].requiredLength;
      return `Debe tener como máximo ${req} caracteres`;
    }
    const firstKey = Object.keys(errors)[0];
    return typeof errors[firstKey] === 'string' ? errors[firstKey] : 'Valor inválido';
  }

  onInput(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  this.control?.setValue(textarea.value);
}

  onBlur() {
    this.control?.markAsTouched();
  }
}
