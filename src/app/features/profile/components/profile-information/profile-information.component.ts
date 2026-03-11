import { Component, EventEmitter, input, Output, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextInputComponent } from '../../../../shared/text-input/text-input.component';
import { TextareaComponent } from '../../../../shared/textarea/textarea.component';
import { User } from '../../../../core/models';
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
    TextInputComponent,
    TextareaComponent,
    ProfileAvatarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit {
  user = input<User | null>(null);
  isLoading = input<boolean>(false);
  form = input.required<FormGroup>();
  @Output() save = new EventEmitter<void>();
  @Output() avatarUpload = new EventEmitter<File>();
  @Output() avatarDelete = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    const user = this.user();
    const form = this.form();
    if (user && form) {
      form.patchValue({
        name: user.name || '',
        email: user.email || '',
        position: user.position || '',
        bio: user.bio || ''
      });
    }
  }

  onFileSelected(file: File): void {
    this.avatarUpload.emit(file);
  }

  onDeleteAvatar(): void {
    this.avatarDelete.emit();
  }

  onSubmit(): void {
    if (this.form().valid) {
      this.save.emit();
    }
  }

  // Helper methods to get properly typed FormControls
  get nameControl(): FormControl {
    return this.form().get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form().get('email') as FormControl;
  }

  get positionControl(): FormControl {
    return this.form().get('position') as FormControl;
  }

  get bioControl(): FormControl {
    return this.form().get('bio') as FormControl;
  }
}
