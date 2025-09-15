import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormTextInputComponent } from '../../../../shared/text-input/form-text-input.component';
import { TextareaComponent } from '../../../../shared/textarea/textarea.component';
import { UserDto } from '../../../../core/api/api-client';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileAvatarComponent } from '../avatar/profile-avatar.component';

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
    FormTextInputComponent,
    TextareaComponent,
    ProfileAvatarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit {
  @Input() user: UserDto | null = null;
  @Input() isLoading = false;
  @Input() form!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() avatarUpload = new EventEmitter<File>();

  constructor() {}

  ngOnInit(): void {
    if (this.user && this.form) {
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

  // Helper methods to get properly typed FormControls
  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get positionControl(): FormControl {
    return this.form.get('position') as FormControl;
  }

  get bioControl(): FormControl {
    return this.form.get('bio') as FormControl;
  }
}
