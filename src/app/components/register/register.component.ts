import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityClient, RegisterModel } from '../../api/api-client';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly client = inject(IdentityClient);
  private readonly router = inject(Router);
  form = this.fb.group({ username: [''], email: [''], password: [''] });
  submit() {
    const model = new RegisterModel({
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? ''
    });
    this.client.register(model).subscribe(() => this.router.navigate(['/login']));
  }
}
