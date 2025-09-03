import { Injectable } from '@angular/core';

const TOKEN_KEY = 'identity_token';
const REFRESH_KEY = 'identity_refresh';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private remember = false;

  setRemember(remember: boolean) {
    this.remember = !!remember;
  }

  private get store() {
    return this.remember ? localStorage : sessionStorage;
  }

  // Read token preferring sessionStorage (non-remember) and falling back to localStorage
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string | null) {
    if (token) {
      // Write only to the selected store and remove from the other to avoid divergence
      this.store.setItem(TOKEN_KEY, token);
      (this.remember ? sessionStorage : localStorage).removeItem(TOKEN_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }

  getRefresh(): string | null {
    return sessionStorage.getItem(REFRESH_KEY) ?? localStorage.getItem(REFRESH_KEY);
  }

  setRefresh(token: string | null) {
    if (token) {
      this.store.setItem(REFRESH_KEY, token);
      (this.remember ? sessionStorage : localStorage).removeItem(REFRESH_KEY);
    } else {
      localStorage.removeItem(REFRESH_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
    }
  }

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  }
}
