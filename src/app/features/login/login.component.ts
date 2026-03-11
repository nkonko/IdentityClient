import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthFacade } from '../../core/facades/auth.facade';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    TranslocoDirective
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    // Remove dark mode for auth pages
    document.body.classList.remove('dark-theme');
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      const val = this.form.value;

      // Set persistence strategy before storing tokens
      this.tokenService.setRemember(!!val.remember);

      this.auth.login(val.username || '', val.password || '').subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: () => {
          this.isLoading = false;
          // Error is automatically handled by ErrorHandlerInterceptor
        }
      });
    }
  }
}
