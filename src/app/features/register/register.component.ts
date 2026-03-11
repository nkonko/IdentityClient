import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    TranslocoDirective
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    // Remove dark mode for auth pages
    document.body.classList.remove('dark-theme');
  }

  protected form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected isLoading = false;
  protected hide = true;

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      const name = this.form.value.username ?? '';
      const email = this.form.value.email ?? '';
      const password = this.form.value.password ?? '';

      this.auth.register(name, email, password).subscribe({
        next: () => {
          this.snackBar.open('Registro exitoso. Iniciando sesión.', 'Cerrar', { duration: 5000 });
          this.router.navigate(['/login']);
        },
        error: () => {
          this.isLoading = false;
          // Error is automatically handled by ErrorHandlerInterceptor
        }
      });
    }
  }
}
