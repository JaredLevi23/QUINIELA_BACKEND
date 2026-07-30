import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router = inject( Router );

  return authService.checkAuthStatus().pipe(
    map( isAuthenticated => {
      if ( !isAuthenticated ) {
        router.navigate(['/auth/login']);
        return false;
      }

      if ( authService.currentUser()?.role !== 'admin' ) {
        router.navigate(['/dashboard/notes-list']);
        return false;
      }

      return true;
    })
  );
};
