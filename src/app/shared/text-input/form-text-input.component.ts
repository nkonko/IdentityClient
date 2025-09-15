import { Component, input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TextInputComponent } from './text-input.component';
import { ValidationErrorService } from './validation-error.service';

@Component({
  selector: 'app-form-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent],
  template: `
    <app-text-input
      [label]="label()"
      [placeholder]="placeholder()"
      [type]="type()"
      [name]="name()"
      [autocomplete]="autocomplete()"
      [required]="required()"
      [disabled]="control().disabled"
      [errorMessage]="currentErrorMessage"
      [formControl]="control()">
    </app-text-input>
  `
})
export class FormTextInputComponent implements OnInit, OnDestroy {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password'>('text');
  name = input<string>();
  autocomplete = input<string>();
  required = input<boolean>(false);
  control = input.required<FormControl>();

  private readonly validationService = inject(ValidationErrorService);
  private readonly destroy$ = new Subject<void>();
  
  currentErrorMessage = '';

  ngOnInit(): void {
    const control = this.control();
    if (control) {
      // Listen to control status changes
      control.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateErrorMessage();
        });

      // Listen to value changes to update error state
      control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateErrorMessage();
        });

      // Initial error check
      this.updateErrorMessage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateErrorMessage(): void {
    const control = this.control();
    const shouldShowError = control?.invalid && (control?.dirty || control?.touched);
    this.currentErrorMessage = shouldShowError 
      ? this.validationService.getErrorMessage(control?.errors) 
      : '';
  }
}