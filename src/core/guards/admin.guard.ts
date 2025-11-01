import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Protege rutas para que SÓLO usuarios 'Admin' puedan entrar.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos los signals de autenticación Y rol
  if (authService.isAuthenticated() && authService.userRole() === 'Admin') {
    return true; // Puede pasar
  }

  // Si no, lo redirigimos al Home (o a una página de "acceso denegado")
  return router.createUrlTree(['/home']); 
};