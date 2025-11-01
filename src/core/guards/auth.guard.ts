import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Protege rutas para que SÓLO usuarios autenticados puedan entrar.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el signal de autenticación
  if (authService.isAuthenticated()) {
    return true; // Puede pasar
  }

  // Si no, lo redirigimos al login
  return router.createUrlTree(['/login']);
};