import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { UserFacade } from '../../core/facades/user.facade';
import { UserDto, UserUpdateDto } from '../../core/api/api-client';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userFacade = inject(UserFacade);
  private readonly snackBar = inject(MatSnackBar);

  protected user: UserDto | null = null;
  protected isLoading = false;
  protected isEditing = false;

  protected profileForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    position: ['Employee', []],
    bio: ['', []],
  });

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.userFacade.me().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          bio: user.bio || '',
          name: user.name || '',
          position: user.position || '',
          email: user.email || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue({
        name: this.user?.name || '',
        email: this.user?.email || '',
        bio: this.user?.bio || '',
        position: this.user?.position || ''
      });
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.user?.id) {
      this.isLoading = true;
      const updateData = new UserUpdateDto({
        email: this.profileForm.value.email || '',
        bio: this.profileForm.value?.bio || '',
        position: this.profileForm.value?.position || '',
        name: this.profileForm.value.name || '',
      });

      this.userFacade.updateProfile(this.user.id, updateData).subscribe({
        next: () => {
          this.isEditing = false;
          this.isLoading = false;
          this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.loadUserProfile();
        },
        error: (error: any) => {
          this.isLoading = false;
          const errorMessage = (error && (error as any).error) ? (error as any).error : 'Error al actualizar el perfil';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}
