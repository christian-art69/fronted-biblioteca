import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. Importa el proveedor de HttpClient
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 2. Añade el proveedor aquí
    //    Usaremos un interceptor (te lo explico más abajo)
    provideHttpClient(withInterceptors([
      authInterceptor
    ]))
  ]
};