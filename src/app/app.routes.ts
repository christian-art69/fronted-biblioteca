import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  
  // --- Rutas Públicas ---
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/public/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'home', // Lista pública de libros
    loadComponent: () => import('./pages/public/home/home.component').then(c => c.HomeComponent)
  },

  // --- Rutas de Estudiante (Requieren login) ---
  {
    path: 'student',
    canActivate: [authGuard], // REQUISITO: Ruta protegida
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/student/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'prestamos', // REQUISITO: Ver "sus propios préstamos"
        loadComponent: () => import('./pages/student/mis-prestamos/mis-prestamos.component').then(c => c.MisPrestamosComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // --- Rutas de Administrador (Requieren login Y rol de Admin) ---
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // REQUISITO: Ruta protegida por Rol
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'libros', // REQUISITO: CRUD Libros
        loadComponent: () => import('./pages/admin/manage-libros/manage-libros.component').then(c => c.ManageLibrosComponent)
      },
      {
        path: 'usuarios', // REQUISITO: CRUD Usuarios
        loadComponent: () => import('./pages/admin/manage-usuarios/manage-usuarios.component').then(c => c.ManageUsuariosComponent)
      },
      {
        path: 'prestamos', // REQUISITO: CRUD Préstamos
        loadComponent: () => import('./pages/admin/manage-prestamos/manage-prestamos.component').then(c => c.ManagePrestamosComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirección por defecto
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Cualquier otra ruta, al home
  { path: '**', redirectTo: 'home' }
];