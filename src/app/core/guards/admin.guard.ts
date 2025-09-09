import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, switchMap } from 'rxjs/operators';
import { selectIsAdmin, selectIsAuthenticated } from '../store/auth/auth.selectors';

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        // Si no está autenticado, redirigir al login
        router.navigate(['/login']);
        return [false];
      }

      // Si está autenticado, verificar si es admin
      return store.select(selectIsAdmin).pipe(
        take(1),
        map(isAdmin => {
          if (!isAdmin) {
            // Si no es admin, redirigir al dashboard
            router.navigate(['/home']);
            return false;
          }
          return true;
        })
      );
    })
  );
};
