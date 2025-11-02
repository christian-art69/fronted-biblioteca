import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILibro } from '../interfaces/libro.interfaces';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // Necesario para el token
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/libros';

  getLibros(): Observable<ILibro[]> {
    return this.http.get<ILibro[]>(this.apiUrl);
  }

  // --- 1. AÑADE TODOS ESTOS MÉTODOS NUEVOS ---

  // Método para buscar libros por título (para prestamos.ts)
  buscarLibrosPorTitulo(titulo: string): Observable<ILibro[]> {
    return this.http.get<ILibro[]>(`${this.apiUrl}/buscar/${titulo}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Método para agregar un nuevo libro
  addLibro(libro: ILibro): Observable<ILibro> {
    return this.http.post<ILibro>(this.apiUrl, libro, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Método para actualizar un libro
  updateLibro(id: string, libro: ILibro): Observable<ILibro> {
    return this.http.put<ILibro>(`${this.apiUrl}/${id}`, libro, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  // Método para eliminar un libro
  deleteLibro(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
}