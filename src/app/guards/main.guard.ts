import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Ya no se necesita 'map' de 'rxjs'

export const mainGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Leemos la señal directamente
  if (authService.isLoggedIn()) {
    return true; // Si está logueado, puede pasar
  } else {
    router.navigate(['/login']); // Si no, lo redirige al login
    return false;
  }
};