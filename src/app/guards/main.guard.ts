// src/app/guards/main.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const mainGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Si está logueado, puede pasar
      } else {
        router.navigate(['/login']); // Si no, lo redirige al login
        return false;
      }
    })
  );
};