import { Injectable, inject } from '@angular/core';
import { IdentityClient, UserUpdateDto as ApiUserUpdateDto, UserPasswordDto } from '../api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserUpdate, UserStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly client = inject(IdentityClient);

  me(): Observable<User> {
    return this.client.me().pipe(map(dto => this.mapToUser(dto)));
  }

  updateProfile(id: string, update: UserUpdate): Observable<void> {
    const dto = new ApiUserUpdateDto();
    dto.email = update.email;
    dto.name = update.name;
    dto.position = update.position;
    dto.bio = update.bio;
    dto.profilePictureUrl = update.profilePictureUrl;
    return this.client.usersPUT(id, dto);
  }

  getUsers(): Observable<User[]> {
    return this.client.usersAll().pipe(
      map(dtos => dtos.map(dto => this.mapToUser(dto)))
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const dto = new UserPasswordDto();
    dto.currentPassword = currentPassword;
    dto.newPassword = newPassword;
    return this.client.password(dto);
  }

  // User status management methods
  updateUserStatus(userId: string, status: UserStatus): Observable<void> {
    const updateDto = new ApiUserUpdateDto();
    updateDto.status = status as any; // Map to API enum
    return this.client.usersPUT(userId, updateDto);
  }

  activateUser(userId: string): Observable<void> {
    return this.updateUserStatus(userId, UserStatus.Active);
  }

  deactivateUser(userId: string): Observable<void> {
    return this.updateUserStatus(userId, UserStatus.Inactive);
  }

  blockUser(userId: string): Observable<void> {
    return this.updateUserStatus(userId, UserStatus.Blocked);
  }

  deleteUser(userId: string): Observable<void> {
    return this.client.usersDELETE(userId);
  }

  private mapToUser(dto: any): User {
    return {
      id: dto.id ?? '',
      name: dto.name ?? '',
      email: dto.email ?? '',
      roles: dto.roles ?? [],
      status: (dto.status as UserStatus) ?? UserStatus.Active,
      position: dto.position,
      bio: dto.bio,
      lastLogin: dto.lastLogin,
      profilePictureUrl: dto.profilePictureUrl,
    };
  }
}
