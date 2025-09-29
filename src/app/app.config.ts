import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {  HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { API_BASE_URL, IdentityClient } from './core/api/api-client';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { authReducer } from './core/store/auth/auth.reducer';
import { roleReducer } from './core/store/roles/roles.reducer';
import { RoleEffects } from './core/store/roles/roles.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      roles: roleReducer
    }),
    provideEffects([RoleEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: IdentityClient,
      useFactory: (http: HttpClient, baseUrl: string) =>
         new IdentityClient(http, baseUrl), deps: [HttpClient, API_BASE_URL] }
  ]
};
