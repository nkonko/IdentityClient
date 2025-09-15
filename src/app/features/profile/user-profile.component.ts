import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { UserFacade } from '../../core/facades/user.facade';
import { UserDto, UserUpdateDto } from '../../core/api/api-client';
import { Store } from '@ngrx/store';
import { updateUserProfileSuccess } from '../../core/store/auth/auth.actions';
import { ProfileInformationComponent } from './components/profile-information/profile-information.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SecurityComponent } from './components/security/security.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { SectionTitleComponent } from "../../shared/section-title/section-title.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    ProfileInformationComponent,
    SecurityComponent,
    NotificationsComponent,
    ButtonComponent,
    SectionTitleComponent
],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userFacade = inject(UserFacade);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);

  user: UserDto | null = null;
  isLoading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    position: [''],
    bio: ['']
  });

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.userFacade.me().subscribe({
      next: (user) => {
        this.user = user;
        // reflect in store so Header and other components get updated
        this.store.dispatch(updateUserProfileSuccess({
          user: {
            id: user.id || '',
            name: user.name || '',
            email: user.email || '',
            roles: user.roles || [],
            position: user.position ?? null,
            bio: user.bio ?? null,
            profilePictureUrl: user.profilePictureUrl ?? null,
            lastLogin: user.lastLogin ?? null
          }
        }));

        this.form.patchValue({
          name: user.name || '',
          email: user.email || '',
          position: user.position || '',
          bio: user.bio || ''
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', { duration: 4000 });
      }
    });
  }

  onAvatarUpload(file: File): void {
    // TODO: Implement avatar upload logic
    this.snackBar.open('Avatar upload functionality coming soon', 'Close', { duration: 3000 });
  }

  save() {
    if (this.form.invalid || !this.user) {
      return;
    }

    this.isLoading = true;
    const update = new UserUpdateDto();
    update.name = this.form.value.name || '';
    update.email = this.form.value.email || '';
    update.position = this.form.value.position || '';
    update.bio = this.form.value.bio || '';

    this.userFacade.updateProfile(this.user.id || '', update).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to update profile', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
