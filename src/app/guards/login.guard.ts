import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Ya no se necesita 'map' de 'rxjs'

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Leemos la señal directamente
  if (!authService.isLoggedIn()) {
    return true; // Si NO está logueado, puede ver el login
  } else {
    router.navigate(['/libros']); // Si YA está logueado, lo mandamos a /libros
    return false;
  }
}