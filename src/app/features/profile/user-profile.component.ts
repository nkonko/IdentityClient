import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TextInputComponent } from '../../shared/text-input/text-input.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { ProfileAvatarComponent } from './components/profile-avatar.component';
import { UserFacade } from '../../core/facades/user.facade';
import { UserDto, UserUpdateDto } from '../../core/api/api-client';
import { ButtonComponent } from '../../shared/button/button.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { updateUserProfileSuccess } from '../../core/store/auth/auth.actions';

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
    SectionTitleComponent,
    ProfileAvatarComponent,
    TextInputComponent,
    TextareaComponent,
    ButtonComponent
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
    position: ['', []],
    bio: ['', []]
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

  onAvatarUpload(file: File) {
    // TODO: Integrate with backend endpoint for avatar upload if available.
    this.snackBar.open('Imagen seleccionada: ' + file.name, 'Cerrar', { duration: 3000 });
  }

  save() {
    if (!this.form.valid || !this.user?.id) return;

    this.isLoading = true;
    const dto = new UserUpdateDto({
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      position: this.form.value.position || '',
      bio: this.form.value.bio || ''
    });

    this.userFacade.updateProfile(this.user.id, dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.loadUserProfile();
      },
      error: (error: any) => {
        this.isLoading = false;
        const msg = error && (error as any).error ? (error as any).error : 'Error al actualizar el perfil';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
