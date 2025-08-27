import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  form = this.fb.group({ username: [''], password: [''] });
  error: string | null = null;
  submit() {
    this.error = null;
    const val = this.form.value;
    this.auth.login(val.username || '', val.password || '').subscribe({ next: () => this.router.navigate(['/dashboard']), error: e => this.error = (e && (e as any).error) ? (e as any).error : 'Login failed' });
  }
}
