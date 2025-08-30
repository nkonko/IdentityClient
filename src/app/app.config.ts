import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { API_BASE_URL, IdentityClient } from './api/api-client';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { authReducer } from './store/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes),
    provideAnimations(),
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
