import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTransloco } from '@jsverse/transloco';

import { routes } from './app.routes';
// Clientes generados por NSwag
import {
  IDENTITY_API_BASE_URL,
  IdentityClient,
  DASHBOARD_API_BASE_URL,
  DashboardClient
} from './core/api';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { authReducer } from './core/store/auth/auth.reducer';
import { roleReducer } from './core/store/roles/roles.reducer';
import { RoleEffects } from './core/store/roles/roles.effects';
import { settingsReducer } from './core/store/settings/settings.reducer';
import { SettingsEffects } from './core/store/settings/settings.effects';
import { featureFlagsReducer } from './core/store/feature-flags/feature-flags.reducer';
import { FeatureFlagsEffects } from './core/store/feature-flags/feature-flags.effects';
import { HttpLoader } from './core/services/transloco-loader.service';
import { languageInitializer } from './core/initializers/language.initializer';
import { settingsInitializer } from './core/initializers/settings.initializer';
import { featureFlagsInitializer } from './core/initializers/feature-flags.initializer';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorHandlerInterceptor])),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      roles: roleReducer,
      settings: settingsReducer,
      featureFlags: featureFlagsReducer
    }),
    provideEffects([RoleEffects, SettingsEffects, FeatureFlagsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    // API Base URLs
    { provide: IDENTITY_API_BASE_URL, useValue: environment.identityApiBaseUrl },
    { provide: DASHBOARD_API_BASE_URL, useValue: environment.dashboardApiBaseUrl },
    provideTransloco({
      config: {
        availableLangs: ['es', 'en'],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: false, // Set to true in production
      },
      loader: HttpLoader
    }),
    languageInitializer,
    settingsInitializer,
    featureFlagsInitializer,
    // Identity API Client
    {
      provide: IdentityClient,
      useFactory: (http: HttpClient, baseUrl: string) => new IdentityClient(http, baseUrl),
      deps: [HttpClient, IDENTITY_API_BASE_URL]
    },
    // Dashboard API Clients
    {
      provide: DashboardClient,
      useFactory: (http: HttpClient, baseUrl: string) => new DashboardClient(http, baseUrl),
      deps: [HttpClient, DASHBOARD_API_BASE_URL]
    }
  ]
};
