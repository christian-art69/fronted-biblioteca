// CÓDIGO ACTUALIZADO
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Ya no se necesitan 'map' ni 'take' de 'rxjs/operators'

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lee la señal directamente
  if (authService.isLoggedIn()) {
    router.navigate(['/libros']); // Redirige a /libros si ya está logueado
    return false;
  } else {
    return true; // Permite acceso a /login si no está logueado
  }
};