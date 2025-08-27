import { Injectable, inject } from '@angular/core';
import { IdentityClient, AuthResponseDto, LoginModel } from '../api/api-client';
import { TokenService } from '../services/token.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly client = inject(IdentityClient);
  private readonly tokenService = inject(TokenService);

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
}
