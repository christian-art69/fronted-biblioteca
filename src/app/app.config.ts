import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. Importa el cliente HTTP y el interceptor
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 2. Añade los proveedores para HttpClient y el interceptor
    provideHttpClient(withInterceptors([
      authInterceptor 
    ]))
  ]
};