import { Injectable, inject } from '@angular/core';
import { IdentityClient, UserDto, UserUpdateDto, UserPasswordDto, UserStatus } from '../api/api-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly client = inject(IdentityClient);

  me(): Observable<UserDto> { return this.client.me(); }
  updateProfile(id: string, update: UserUpdateDto) { return this.client.usersPUT(id, update); }
  getUsers(): Observable<UserDto[]> { return this.client.usersAll(); }
  
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const dto = new UserPasswordDto();
    dto.currentPassword = currentPassword;
    dto.newPassword = newPassword;
    return this.client.password(dto);
  }
  
  // User status management methods
  updateUserStatus(userId: string, status: UserStatus): Observable<void> {
    const updateDto = new UserUpdateDto();
    updateDto.status = status;
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
}
