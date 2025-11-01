import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Intercepta CADA petición HTTP para añadir el token de autenticación
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Inyectamos el AuthService (lo crearemos en el siguiente paso)
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si no hay token (como en el login/register), deja pasar la petición
  if (!token) {
    return next(req);
  }

  // Si hay token, clona la petición y añade la cabecera 'Authorization'
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  // Envía la petición con el token
  return next(authReq);
};