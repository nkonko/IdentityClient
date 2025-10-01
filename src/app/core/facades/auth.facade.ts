import { Injectable, inject } from '@angular/core';
import { IdentityClient, AuthResponseDto, LoginModel, UserPasswordDto, RegisterModel, UserStatus } from '../api/api-client';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';
import { LoggingService } from '../services/logging.service';
import { map, BehaviorSubject, Observable, tap, switchMap, catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import { User } from '../store/auth/auth.actions';
import { UserProfileService } from '../services/user-profile.service';
import { UserFacade } from './user.facade';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly client = inject(IdentityClient);
  private readonly tokenService = inject(TokenService);
  private readonly navigationService = inject(NavigationService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly userFacade = inject(UserFacade);
  private readonly logger = inject(LoggingService);
  private readonly store = inject(Store);

  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(!!this.tokenService.getToken());
  public readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  private readonly componentName = 'AuthFacade';

  get isAuthenticated(): boolean {
    return this._isAuthenticated$.value;
  }

  login(username: string, password: string): Observable<void> {

    const model = new LoginModel({ username, password });
    return this.client.login(model).pipe(
      tap((res: AuthResponseDto) => {
        this.logger.log(this.componentName, 'Login response received, token exists:', !!res.token);
      }),
      switchMap((res: AuthResponseDto) => {
        if (res && res.token) {
          this.logger.log(this.componentName, 'Setting token in storage');
          this.tokenService.setToken(res.token);

          if (res.refreshToken && res.refreshToken.token) {
            this.logger.log(this.componentName, 'Setting refresh token');
            this.tokenService.setRefresh(res.refreshToken.token);
          }

          // Cargar perfil de usuario para verificar estado
          return this.userProfileService.loadProfile().pipe(
            switchMap((userProfile: User) => {
              const userStatus = userProfile.status;
              
              this.logger.log(this.componentName, 'User status:', userStatus);
              
              // Si el usuario está bloqueado, impedir login
              if (userStatus === UserStatus.Blocked) {
                this.logger.warn(this.componentName, 'User is blocked, denying access');
                this.logout(); // Limpiar tokens
                return throwError(() => new Error('Su cuenta ha sido bloqueada. Contacte al administrador.'));
              }
              
              // Si el usuario está inactivo, activarlo
              if (userStatus === UserStatus.Inactive) {
                this.logger.log(this.componentName, 'User is inactive, activating...');
                return this.userFacade.activateUser(userProfile.id).pipe(
                  switchMap(() => {
                    // Recargar el perfil después de la activación
                    return this.userProfileService.loadAndStoreProfile().pipe(
                      tap((updatedProfile: User) => {
                        this.store.dispatch(AuthActions.loginSuccess({ user: updatedProfile, token: res.token! }));
                        this._isAuthenticated$.next(true);
                        this.logger.log(this.componentName, 'User activated and logged in successfully');
                        this.navigationService.redirectToDashboard();
                      }),
                      map(() => void 0)
                    );
                  }),
                  catchError(activationError => {
                    this.logger.error(this.componentName, 'Failed to activate user:', activationError);
                    this.logout();
                    return throwError(() => new Error('Error al activar la cuenta. Intente nuevamente.'));
                  })
                );
              }
              
              // Usuario activo - proceder normalmente
              this.store.dispatch(AuthActions.updateUserProfileSuccess({ user: userProfile }));
              this.store.dispatch(AuthActions.loginSuccess({ user: userProfile, token: res.token! }));
              this._isAuthenticated$.next(true);
              this.logger.log(this.componentName, 'Active user logged in successfully');
              this.navigationService.redirectToDashboard();
              
              return new Observable<void>(subscriber => {
                subscriber.next();
                subscriber.complete();
              });
            })
          );
        } else {
          this.logger.error(this.componentName, 'No token received in response');
          return throwError(() => new Error('No token'));
        }
      })
    );
  }

  logout() {
    this.logger.log(this.componentName, 'Logout called');
    this.tokenService.clear();
    this._isAuthenticated$.next(false);
    this.logger.log(this.componentName, 'Authentication state updated to false');
    this.navigationService.redirectToLogin();
  }

  changePassword(payload: UserPasswordDto) {
    return this.client.password(payload);
  }

  register(username: string, email: string, password: string): Observable<void> {
    const model = new RegisterModel({ username, email, password });

    return this.client.register(model).pipe(
      // After successful registration, automatically log the user in
      switchMap(() => this.login(username, password)),
      catchError(error => {
        this.logger.error(this.componentName, 'Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  // Método para verificar el estado inicial
  checkAuthStatus() {
    const token = this.tokenService.getToken();
    const hasToken = !!token;
    this._isAuthenticated$.next(hasToken);

    if (hasToken) {
      this.store.dispatch(AuthActions.checkAuthStatus());
      this.userProfileService.loadProfile().subscribe({
        next: (user) => {
          if(token) {
            this.store.dispatch(AuthActions.checkAuthStatusSuccess({ user, token }));
          }
        },
        error: (err) => {
          this.logger.error(this.componentName, 'Failed to load user profile on init, logging out:', err);
          this.store.dispatch(AuthActions.checkAuthStatusFailure());
          this.logout(); // If loading profile fails, log out
        }
      });
    }
  }

  // Método para debug - obtener el token actual
  getCurrentToken(): string | null {
    return this.tokenService.getToken();
  }
}
