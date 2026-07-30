import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  // console.log('isAuthenticatedGuard');
  // console.log({ route, state });
  
  const authService = inject( AuthService );
  const router = inject( Router );
  
  console.log({ status: authService.authStatus() } );
  
  return authService.checkAuthStatus().pipe(
    map( isAuthenticated => {
      if( !isAuthenticated ){
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    }
  ));
};
