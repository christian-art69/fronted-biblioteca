import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPrestamo } from '../interfaces/prestamo.interfaces';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/prestamos';

  // --- 1. AÑADE TODOS ESTOS MÉTODOS ---

  // Obtener todos los préstamos (Admin)
  getPrestamos(): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(this.apiUrl, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Obtener préstamos de un usuario (Usuario)
  getPrestamosPorUsuario(usuarioId: string): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Agregar un nuevo préstamo (Admin)
  addPrestamo(prestamoData: { usuario: string, libro: string, fechaDevolucion: Date }): Observable<IPrestamo> {
    return this.http.post<IPrestamo>(this.apiUrl, prestamoData, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Registrar la devolución de un libro (Admin)
  devolverPrestamo(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/devolver/${id}`, {}, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Obtener todo el historial (Admin)
  getHistorial(): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/historial/todos`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Obtener historial de un usuario (Usuario)
  getHistorialPorUsuario(usuarioId: string): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/historial/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
}