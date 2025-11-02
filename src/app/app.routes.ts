import { Routes } from '@angular/router';
import { Libros } from './libros/libros';
import { Usuarios } from './usuarios/usuarios';
import { Prestamos } from './prestamos/prestamos';
import { Login } from './login/login';
import { mainGuard } from './guards/main.guard';
import { loginGuard } from './guards/login.guard';
import { Historial } from './historial/historial';


export const appRoutes: Routes = [
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'libros', component: Libros, canActivate: [mainGuard] },
  { path: 'usuarios', component: Usuarios, canActivate: [mainGuard] },
  { path: 'prestamos', component: Prestamos, canActivate: [mainGuard] },
  { path: 'historial', component: Historial, canActivate: [mainGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];