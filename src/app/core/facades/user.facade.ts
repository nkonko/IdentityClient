import { Injectable, inject } from '@angular/core';
import { IdentityClient, UserDto, UserUpdateDto } from '../api/api-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly client = inject(IdentityClient);

  me(): Observable<UserDto> { return this.client.me(); }
  updateProfile(id: string, update: UserUpdateDto) { return this.client.usersPUT(id, update); }
  getUsers(): Observable<UserDto[]> { return this.client.usersAll(); }

}
