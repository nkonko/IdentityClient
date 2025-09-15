import { Injectable, inject } from '@angular/core';
import { UserDto } from '../api/api-client';
import { map, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { updateUserProfileSuccess, User as AuthUser } from '../store/auth/auth.actions';
import { UserFacade } from '../facades/user.facade';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly userFacade = inject(UserFacade);
  private readonly store = inject(Store);

  // Mapea UserDto (API) -> AuthUser (estado)
  private mapUser(dto: UserDto): AuthUser {
    return {
      id: dto.id || '',
      name: dto.name || '',
      email: dto.email || '',
      roles: dto.roles || [],
      status: dto.status,
      position: dto.position ?? null,
      bio: dto.bio ?? null,
      profilePictureUrl: dto.profilePictureUrl ?? null,
      lastLogin: dto.lastLogin ?? null
    };
  }

  // Obtiene el perfil desde API usando el UserFacade y lo devuelve mapeado
  loadProfile(): Observable<AuthUser> {
    return this.userFacade.me().pipe(map(dto => this.mapUser(dto)));
  }

  // Obtiene el perfil y lo guarda en el store
  loadAndStoreProfile(): Observable<AuthUser> {
    return this.loadProfile().pipe(
      tap((user) => this.store.dispatch(updateUserProfileSuccess({ user })))
    );
  }
}
