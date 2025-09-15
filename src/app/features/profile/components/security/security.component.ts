import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextInputComponent } from '../../../../shared/text-input/text-input.component';
import { UserFacade } from '../../../../core/facades/user.facade';
import { passwordMatchValidator } from '../../../../core/validators/password.validators';

interface PasswordForm {
  currentPassword: FormControl<string | null>;
  newPassword: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TextInputComponent
  ],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecurityComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userFacade = inject(UserFacade);
  private readonly snackBar = inject(MatSnackBar);

  isLoading = false;

  passwordForm = this.fb.group<PasswordForm>({
    currentPassword: this.fb.control('', [Validators.required]),
    newPassword: this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator()
    ]),
    confirmPassword: this.fb.control('', [Validators.required])
  }, { validators: passwordMatchValidator('newPassword', 'confirmPassword') });

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && value.length >= 8;

      if (isValid) {
        return null;
      }

      return {
        passwordStrength: {
          hasUpperCase: !hasUpperCase,
          hasLowerCase: !hasLowerCase,
          hasNumeric: !hasNumeric,
          hasSpecialChar: !hasSpecialChar,
          minLength: value.length < 8
        }
      };
    };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;

    const currentPassword = this.passwordForm.value.currentPassword;
    const newPassword = this.passwordForm.value.newPassword;

    if (!currentPassword || !newPassword) {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    this.userFacade.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', { duration: 3000 });
        this.passwordForm.reset();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.snackBar.open(error.error?.message || 'Error al actualizar la contraseña', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
