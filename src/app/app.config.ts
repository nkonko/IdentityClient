import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { API_BASE_URL, IdentityClient } from './api/api-client';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
  { provide: API_BASE_URL, useValue: 'http://localhost:5000' },
  { provide: IdentityClient,
    useFactory: (http: HttpClient, baseUrl: string) =>
       new IdentityClient(http, baseUrl), deps: [HttpClient, API_BASE_URL] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
