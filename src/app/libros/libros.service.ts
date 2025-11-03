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
  private authService = inject(AuthService); 
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/libros';

  getLibros(): Observable<ILibro[]> {
    return this.http.get<ILibro[]>(this.apiUrl);
  }
  buscarLibrosPorTitulo(titulo: string): Observable<ILibro[]> {
    return this.http.get<ILibro[]>(`${this.apiUrl}/buscar/${titulo}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
  addLibro(libro: ILibro): Observable<ILibro> {
    return this.http.post<ILibro>(this.apiUrl, libro, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
  updateLibro(id: string, libro: ILibro): Observable<ILibro> {
    return this.http.put<ILibro>(`${this.apiUrl}/${id}`, libro, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
  deleteLibro(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }
}