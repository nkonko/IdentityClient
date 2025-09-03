import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthFacade } from '../../core/facades/auth.facade';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly tokenService = inject(TokenService);

  protected form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  protected isLoading = false;
  protected hide = true; // show/hide password

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      const val = this.form.value;

      // Set persistence strategy before storing tokens
      this.tokenService.setRemember(!!val.remember);

      this.auth.login(val.username || '', val.password || '').subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (e) => {
          this.isLoading = false;
          const errorMessage = (e && (e as any).error) ? (e as any).error : 'Sign-in error';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }
}
