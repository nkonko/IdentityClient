import { inject, Injectable, Inject } from '@angular/core';
import { TokenService } from './token.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponseDto, LoginModel, UserDto, UserPasswordDto, UserUpdateDto, IdentityClient, API_BASE_URL } from '../api/api-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenService = inject(TokenService);
  private readonly client = inject(IdentityClient);

  login(username: string, password: string): Observable<void> {
    const model = new LoginModel({ username, password });
    return this.client.login(model).pipe(map((res: AuthResponseDto) => {
      if (res && res.token) {
        this.tokenService.setToken(res.token);
        if (res.refreshToken && (res.refreshToken as any).token) this.tokenService.setRefresh((res.refreshToken as any).token);
      }
    }));
  }

  logout() { this.tokenService.clear(); }
  me(): Observable<UserDto> { return this.client.me(); }
  updateProfile(id: string, update: UserUpdateDto) { return this.client.usersPUT(id, update); }
  changePassword(payload: UserPasswordDto) { return this.client.password(payload); }
}
