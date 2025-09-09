import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { ProfileAvatarComponent } from './components/profile-avatar.component';
import { UserFacade } from '../../core/facades/user.facade';
import { UserDto, UserUpdateDto } from '../../core/api/api-client';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    SectionTitleComponent,
    ProfileAvatarComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userFacade = inject(UserFacade);
  private readonly snackBar = inject(MatSnackBar);

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
