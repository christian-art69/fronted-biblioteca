import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { appRoutes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';

registerLocaleData(localeEsCl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),

    { provide: LOCALE_ID, useValue: 'es-CL' }
  ]
};