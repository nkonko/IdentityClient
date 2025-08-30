import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {  HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { API_BASE_URL, IdentityClient } from './api/api-client';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { authReducer } from './store/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideStore({
      auth: authReducer
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    { provide: API_BASE_URL, useValue: 'https://localhost:65252' },
    { provide: IdentityClient,
      useFactory: (http: HttpClient, baseUrl: string) =>
         new IdentityClient(http, baseUrl), deps: [HttpClient, API_BASE_URL] }
  ]
};
