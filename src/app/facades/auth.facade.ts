import { Injectable, inject } from '@angular/core';
import { IdentityClient, AuthResponseDto, LoginModel, UserPasswordDto, RegisterModel } from '../api/api-client';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';
import { map, BehaviorSubject, Observable } from 'rxjs';

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
    const model = new LoginModel({ username, password });
    return this.client.login(model).pipe(map((res: AuthResponseDto) => {
      if (res && res.token) {
        this.tokenService.setToken(res.token);
        if (res.refreshToken && (res.refreshToken as any).token) {
          this.tokenService.setRefresh((res.refreshToken as any).token);
        }
        this._isAuthenticated$.next(true);
        this.navigationService.redirectToDashboard();
      }
    }));
  }

  logout() {
    this.tokenService.clear();
    this._isAuthenticated$.next(false);
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
    this._isAuthenticated$.next(hasToken);
  }
}
