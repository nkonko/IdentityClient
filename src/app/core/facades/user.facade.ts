import { Injectable, inject } from '@angular/core';
import { IdentityClient, UserDto, UserUpdateDto, UserPasswordDto } from '../api/api-client';
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
}
