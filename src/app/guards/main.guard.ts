// CÓDIGO ACTUALIZADO
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Ya no se necesitan 'map' ni 'take' de 'rxjs/operators'

export const mainGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lee el valor de las señales directamente
  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.userRole();

  if (isLoggedIn) {
    if (userRole === 'Admin') {
      return true; // Admin tiene acceso a todo
    } else {
      // Si es 'Usuario', solo permite acceso a 'prestamos' y 'libros'
      if (state.url === '/prestamos' || state.url === '/libros') {
        return true;
      }
      router.navigate(['/libros']); // Redirige a /libros si intenta acceder a otra ruta de admin
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }
};