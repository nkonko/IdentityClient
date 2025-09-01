import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthFacade } from '../facades/auth.facade';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authFacade = inject(AuthFacade);

  const token = tokenService.getToken();

  // Log para debug
  console.log('AuthInterceptor - URL:', req.url);
  console.log('AuthInterceptor - Token exists:', !!token);
  if (token) {
    console.log('AuthInterceptor - Token length:', token.length);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('AuthInterceptor - Headers:', cloned.headers);

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('AuthInterceptor - Error:', error);

        if (error.status === 401) {
          console.log('AuthInterceptor - Unauthorized, clearing token');
          authFacade.logout();
        }

        return throwError(() => error);
      })
    );
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('AuthInterceptor - Error without token:', error);
      return throwError(() => error);
    })
  );
};
