import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorService {
  
  getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) return '';

    // Common validation errors with Spanish messages
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }
    
    if (errors['email']) {
      return 'Formato de correo inválido';
    }
    
    if (errors['minlength']) {
      const required = errors['minlength'].requiredLength;
      const actual = errors['minlength'].actualLength;
      return `Debe tener al menos ${required} caracteres (actual: ${actual})`;
    }
    
    if (errors['maxlength']) {
      const required = errors['maxlength'].requiredLength;
      return `Debe tener como máximo ${required} caracteres`;
    }
    
    if (errors['pattern']) {
      return 'El formato no es válido';
    }
    
    if (errors['min']) {
      return `El valor debe ser mayor o igual a ${errors['min'].min}`;
    }
    
    if (errors['max']) {
      return `El valor debe ser menor o igual a ${errors['max'].max}`;
    }

    // Password-specific validations
    if (errors['passwordStrength']) {
      return 'La contraseña no cumple con los requisitos de seguridad';
    }
    
    if (errors['passwordMatch']) {
      return 'Las contraseñas no coinciden';
    }

    // Phone validations
    if (errors['phone']) {
      return 'Formato de teléfono inválido';
    }

    // URL validations
    if (errors['url']) {
      return 'Formato de URL inválido';
    }

    // Custom validation - fallback
    const firstErrorKey = Object.keys(errors)[0];
    const errorValue = errors[firstErrorKey];
    
    // If the error has a message property, use it
    if (typeof errorValue === 'object' && errorValue?.message) {
      return errorValue.message;
    }
    
    // If the error value is a string, use it directly
    if (typeof errorValue === 'string') {
      return errorValue;
    }
    
    // Generic fallback
    return 'Valor inválido';
  }

  hasError(errors: ValidationErrors | null, errorType: string): boolean {
    return !!(errors && errors[errorType]);
  }

  getFirstError(errors: ValidationErrors | null): string | null {
    if (!errors) return null;
    return Object.keys(errors)[0] || null;
  }
}