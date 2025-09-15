import { Injectable, inject } from '@angular/core';
import { IdentityClient, AuthResponseDto, LoginModel, UserPasswordDto, RegisterModel } from '../api/api-client';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';
import { LoggingService } from '../services/logging.service';
import { map, BehaviorSubject, Observable, tap, switchMap, catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import { User } from '../store/auth/auth.actions';
import { UserProfileService } from '../services/user-profile.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly client = inject(IdentityClient);
  private readonly tokenService = inject(TokenService);
  private readonly navigationService = inject(NavigationService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly logger = inject(LoggingService);
  private readonly store = inject(Store);

  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(!!this.tokenService.getToken());
  public readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  private readonly componentName = 'AuthFacade';

  get isAuthenticated(): boolean {
    return this._isAuthenticated$.value;
  }

  login(username: string, password: string): Observable<void> {
    this.logger.log(this.componentName, 'Login attempt for user:', username);

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

          // Una vez guardado el token, cargamos el perfil usando el servicio centralizado
          return this.userProfileService.loadAndStoreProfile().pipe(
            tap((userProfile: User) => {
              // Además, disparamos el loginSuccess con el usuario (por compatibilidad si se usa en otros reducers/efectos)
              this.store.dispatch(AuthActions.loginSuccess({ user: userProfile, token: res.token! }));

              this._isAuthenticated$.next(true);
              this.logger.log(this.componentName, 'Authentication state updated to true');
              this.navigationService.redirectToDashboard();
            }),
            map(() => void 0)
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
    this.logger.log(this.componentName, 'Register attempt for user:', username);
    const model = new RegisterModel({ username, email, password });

    return this.client.register(model).pipe(
      tap(() => {
        this.logger.log(this.componentName, 'Registration successful, attempting auto-login');
      }),
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
