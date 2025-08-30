import { Injectable, inject } from '@angular/core';
import { IdentityClient, AuthResponseDto, LoginModel, UserPasswordDto, RegisterModel } from '../api/api-client';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';
import { map, BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly client = inject(IdentityClient);
  private readonly tokenService = inject(TokenService);
  private readonly navigationService = inject(NavigationService);

  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(!!this.tokenService.getToken());
  public readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  get isAuthenticated(): boolean {
    return this._isAuthenticated$.value;
  }

  login(username: string, password: string): Observable<void> {
    console.log('AuthFacade - Login attempt for user:', username);

    const model = new LoginModel({ username, password });
    return this.client.login(model).pipe(
      tap((res: AuthResponseDto) => {
        console.log('AuthFacade - Login response:', res);
        console.log('AuthFacade - Token received:', !!res.token);
        console.log('AuthFacade - Token length:', res.token?.length);
      }),
      map((res: AuthResponseDto) => {
        if (res && res.token) {
          console.log('AuthFacade - Setting token in storage');
          this.tokenService.setToken(res.token);

          if (res.refreshToken && res.refreshToken.token) {
            console.log('AuthFacade - Setting refresh token');
            this.tokenService.setRefresh(res.refreshToken.token);
          }

          this._isAuthenticated$.next(true);
          console.log('AuthFacade - Authentication state updated to true');
          this.navigationService.redirectToDashboard();
        } else {
          console.error('AuthFacade - No token received in response');
        }
      })
    );
  }

  logout() {
    console.log('AuthFacade - Logout called');
    this.tokenService.clear();
    this._isAuthenticated$.next(false);
    console.log('AuthFacade - Authentication state updated to false');
    this.navigationService.redirectToLogin();
  }

  changePassword(payload: UserPasswordDto) {
    return this.client.password(payload);
  }

  register(username: string, email: string, password: string): Observable<void> {
    const model = new RegisterModel({ username, email, password });
    return this.client.register(model).pipe(map(() => { }));
  }

  // Método para verificar el estado inicial
  checkAuthStatus() {
    const hasToken = !!this.tokenService.getToken();
    console.log('AuthFacade - Checking auth status, has token:', hasToken);
    if (hasToken) {
      console.log('AuthFacade - Token length:', this.tokenService.getToken()?.length);
    }
    this._isAuthenticated$.next(hasToken);
  }

  // Método para debug - obtener el token actual
  getCurrentToken(): string | null {
    return this.tokenService.getToken();
  }
}
