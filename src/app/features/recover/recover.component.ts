import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    RouterLink
  ],
  styleUrls: ['./recover.component.scss'],
  templateUrl: './recover.component.html',
})
export class RecoverComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  ngOnInit(): void {
    // Remove dark mode for auth pages
    document.body.classList.remove('dark-theme');
  }

  submit() { alert('Recovery flow to be implemented on backend'); }
}
