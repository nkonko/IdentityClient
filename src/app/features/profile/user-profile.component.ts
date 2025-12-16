import { Component, OnInit, inject, viewChild } from '@angular/core';
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
import { NotificationsComponent, NotificationPreferences } from './components/notifications/notifications.component';
import { SecurityComponent } from './components/security/security.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { SectionTitleComponent } from "../../shared/section-title/section-title.component";
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { SkeletonInputComponent } from '../../shared/skeleton/skeleton-input.component';
import { SkeletonTextareaComponent } from '../../shared/skeleton/skeleton-textarea.component';
import { SkeletonAvatarComponent } from '../../shared/skeleton/skeleton-avatar.component';
import { SkeletonButtonComponent } from '../../shared/skeleton/skeleton-button.component';
import { SkeletonFormComponent } from '../../shared/skeleton/skeleton-form.component';

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
    SectionTitleComponent,
    SkeletonComponent,
    SkeletonInputComponent,
    SkeletonTextareaComponent,
    SkeletonAvatarComponent,
    SkeletonButtonComponent,
    SkeletonFormComponent
],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  securityComponent = viewChild(SecurityComponent);
  notificationsComponent = viewChild(NotificationsComponent);
  
  private readonly fb = inject(FormBuilder);
  private readonly userFacade = inject(UserFacade);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);

  user: UserDto | null = null;
  isLoading = false;
  currentTab = 0; // Para saber qué tab está activa

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    position: [''],
    bio: ['']
  });

  // Form for notification preferences
  notificationPreferences: NotificationPreferences = {
    emailNotifications: false,
    inAppNotifications: true,
    emailSecurityAlerts: true,
    emailAccountActivity: false,
    emailSystemUpdates: false,
    inAppRealTimeAlerts: true,
    inAppSystemMessages: true
  };

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

  async save() {
    if (this.currentTab === 0) {
      // Tab Profile Information
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
          // Actualizar el store para que el header se actualice
          this.store.dispatch(updateUserProfileSuccess({
            user: {
              id: this.user?.id || '',
              name: update.name || '',
              email: update.email || '',
              roles: this.user?.roles || [],
              position: update.position || null,
              bio: update.bio || null,
              profilePictureUrl: this.user?.profilePictureUrl || null,
              lastLogin: this.user?.lastLogin || null
            }
          }));
          
          // También actualizar el objeto local
          if (this.user) {
            this.user.name = update.name;
            this.user.email = update.email;
            this.user.position = update.position;
            this.user.bio = update.bio;
          }
          
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          this.form.markAsPristine();
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to update profile', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else if (this.currentTab === 1) {
      // Tab Security
      const securityComp = this.securityComponent();
      if (securityComp && securityComp.isFormValid) {
        this.isLoading = true;
        try {
          await securityComp.savePassword();
          this.snackBar.open('Password updated successfully', 'Close', { duration: 3000 });
        } catch (error) {
          this.snackBar.open('Failed to update password', 'Close', { duration: 3000 });
        } finally {
          this.isLoading = false;
        }
      }
    } else if (this.currentTab === 2) {
      // Tab Notifications
      const notificationsComp = this.notificationsComponent();
      if (notificationsComp) {
        this.isLoading = true;
        try {
          await notificationsComp.saveNotificationPreferences();
          this.snackBar.open('Notification preferences updated successfully', 'Close', { duration: 3000 });
        } catch (error) {
          this.snackBar.open('Failed to update notification preferences', 'Close', { duration: 3000 });
        } finally {
          this.isLoading = false;
        }
      }
    }
  }

  onTabChanged(event: any): void {
    this.currentTab = event.index;
  }

  get canSave(): boolean {
    if (this.currentTab === 0) {
      return this.form.valid && this.form.dirty && !this.isLoading;
    } else if (this.currentTab === 1) {
      const securityComp = this.securityComponent();
      return (securityComp?.isFormValid || false) && !this.isLoading;
    } else if (this.currentTab === 2) {
      const notificationsComp = this.notificationsComponent();
      return (notificationsComp?.hasUnsavedChanges || false) && !this.isLoading;
    }
    return false;
  }

  get saveButtonText(): string {
    switch (this.currentTab) {
      case 0: return 'Save Profile';
      case 1: return 'Update Password';
      case 2: return 'Save Preferences';
      default: return 'Save';
    }
  }
}
