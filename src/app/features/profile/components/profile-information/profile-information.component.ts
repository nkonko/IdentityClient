import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextInputComponent } from '../../../../shared/text-input/text-input.component';
import { TextareaComponent } from '../../../../shared/textarea/textarea.component';
import { UserDto } from '../../../../core/api/api-client';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileAvatarComponent } from '../avatar/profile-avatar.component';

interface ProfileForm extends FormGroup<{
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  position: FormControl<string | null>;
  bio: FormControl<string | null>;
}> {}

@Component({
  selector: 'app-profile-information',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TextInputComponent,
    TextareaComponent,
    ProfileAvatarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent {
  @Input() user: UserDto | null = null;
  @Input() isLoading = false;
  @Output() save = new EventEmitter<void>();
  @Output() avatarUpload = new EventEmitter<File>();

  form: ProfileForm;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      position: [''],
      bio: ['']
    }) as ProfileForm;
  }

  ngOnInit(): void {
    if (this.user) {
      this.form.patchValue({
        name: this.user.name || '',
        email: this.user.email || '',
        position: this.user.position || '',
        bio: this.user.bio || ''
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.avatarUpload.emit(file);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit();
    }
  }
}
