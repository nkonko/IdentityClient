import { Injectable, inject } from '@angular/core';
import { User } from '../models';
import { map, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { updateUserProfileSuccess, User as AuthUser } from '../store/auth/auth.actions';
import { UserFacade } from '../facades/user.facade';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly userFacade = inject(UserFacade);
  private readonly store = inject(Store);

  // Mapea User (domain model) -> AuthUser (estado)
  private mapUser(user: User): AuthUser {
    return {
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      roles: user.roles || [],
      status: user.status,
      position: user.position ?? null,
      bio: user.bio ?? null,
      profilePictureUrl: user.profilePictureUrl ?? null,
      lastLogin: user.lastLogin ?? null
    };
  }

  // Obtiene el perfil desde API usando el UserFacade y lo devuelve mapeado
  loadProfile(): Observable<AuthUser> {
    return this.userFacade.me().pipe(map(user => this.mapUser(user)));
  }

  // Obtiene el perfil y lo guarda en el store
  loadAndStoreProfile(): Observable<AuthUser> {
    return this.loadProfile().pipe(
      tap((user) => this.store.dispatch(updateUserProfileSuccess({ user })))
    );
  }
}
