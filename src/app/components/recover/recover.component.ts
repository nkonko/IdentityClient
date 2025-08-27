import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="card"><h2>Recuperar contraseña</h2>
    <form (ngSubmit)="submit()" [formGroup]="form">
      <div class="field"><label>Email</label><input formControlName="email" type="email" /></div>
      <div class="actions"><button type="submit">Enviar</button></div>
    </form>
  </div>
  `
})
export class RecoverComponent {
  private readonly fb = inject(FormBuilder);
  form = this.fb.group({ email: [''] });
  submit() { alert('Funcionalidad de recuperación pendiente de implementar en backend'); }
}
