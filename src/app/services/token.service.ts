import { Injectable } from '@angular/core';

const TOKEN_KEY = 'identity_token';
const REFRESH_KEY = 'identity_refresh';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
  setToken(token: string | null) {
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
  }
  getRefresh(): string | null { return localStorage.getItem(REFRESH_KEY); }
  setRefresh(token: string | null) {
    if (token) localStorage.setItem(REFRESH_KEY, token); else localStorage.removeItem(REFRESH_KEY);
  }
  clear() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); }
}
