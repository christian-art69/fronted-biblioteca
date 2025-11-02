import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsuario } from '../interfaces/usuario.interfaces';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // Inyecta el AuthService
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/usuarios';

  checkConnection(): Observable<any> {
    return this.http.get<any>('https://backend-biblioteca-u4k0.onrender.com/api/test/connection');
  }

  getUsuarioById(id: string): Observable<IUsuario> {
    // Añade el token para proteger esta ruta
    return this.http.get<IUsuario>(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  getUsuarios(): Observable<IUsuario[]> {
    // Añade el token para proteger esta ruta
    return this.http.get<IUsuario[]>(this.apiUrl, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // --- 1. AÑADE TODOS ESTOS MÉTODOS NUEVOS ---

  // Método para buscar usuario por RUT (para prestamos.ts)
  getUsuarioPorRut(rut: string): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this.apiUrl}/rut/${rut}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Método para actualizar un usuario
  updateUsuario(id: string, usuario: IUsuario): Observable<IUsuario> {
    return this.http.put<IUsuario>(`${this.apiUrl}/${id}`, usuario, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Método para eliminar un usuario
  deleteUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
}