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
  private apiUrl = 'https://backend-biblioteca-kftz.onrender.com/api/prestamos';
  
  // MÉTODO PARA ADMIN: Obtiene TODOS los préstamos (llama a GET /api/prestamos)
  getPrestamosAdmin(): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(this.apiUrl, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // MÉTODO PARA USUARIO: Obtiene SÓLO los préstamos del usuario logueado
  getMisPrestamos(): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/mis-prestamos`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // (Este método ya no lo usa la lógica principal de carga)
  getPrestamosPorUsuario(usuarioId: string): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  addPrestamo(prestamoData: { usuario: string, libro: string, fechaDevolucion: Date }): Observable<IPrestamo> {
    return this.http.post<IPrestamo>(this.apiUrl, prestamoData, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  devolverPrestamo(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/devolver/${id}`, {}, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  getHistorial(): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/historial/todos`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  getHistorialPorUsuario(usuarioId: string): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(`${this.apiUrl}/historial/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
}