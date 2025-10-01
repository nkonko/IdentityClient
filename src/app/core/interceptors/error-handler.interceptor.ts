import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';

export const ErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: any) => {
      // Auto-handle all errors globally
      if (shouldAutoHandle(error, req.url)) {
        errorHandler.displayError(error);
      }
      
      return throwError(() => error);
    })
  );
};

function shouldAutoHandle(error: HttpErrorResponse, url: string): boolean {
  // Don't auto-handle 401 on auth endpoints (login/register) - let auth facade handle it
  if (error.status === 401 && url.includes('/auth/')) return false;
  
  // Auto-handle all other errors including validation errors (400)
  if (error.status >= 400) return true;
  
  return false;
}