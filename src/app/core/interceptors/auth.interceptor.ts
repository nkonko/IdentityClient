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

  if (token) {
    // Don't set Content-Type for FormData - browser will set it automatically with boundary
    const isFormData = req.body instanceof FormData;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const cloned = req.clone({
      setHeaders: headers
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expirado o inválido - hacer logout automático
          authFacade.logout();
        }
        return throwError(() => error);
      })
    );
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error);
    })
  );
};
