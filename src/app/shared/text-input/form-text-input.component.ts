import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
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
      [label]="label"
      [placeholder]="placeholder"
      [type]="type"
      [name]="name"
      [autocomplete]="autocomplete"
      [required]="required"
      [disabled]="control.disabled"
      [errorMessage]="currentErrorMessage"
      [formControl]="control">
    </app-text-input>
  `
})
export class FormTextInputComponent implements OnInit, OnDestroy {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() required = false;
  @Input() control!: FormControl;

  private readonly validationService = inject(ValidationErrorService);
  private readonly destroy$ = new Subject<void>();
  
  currentErrorMessage = '';

  ngOnInit(): void {
    if (this.control) {
      // Listen to control status changes
      this.control.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateErrorMessage();
        });

      // Listen to value changes to update error state
      this.control.valueChanges
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
    const shouldShowError = this.control?.invalid && (this.control?.dirty || this.control?.touched);
    this.currentErrorMessage = shouldShowError 
      ? this.validationService.getErrorMessage(this.control?.errors) 
      : '';
  }
}