// src/app/libros/libro.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILibro, ICrearLibro } from '../interfaces/libro.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/libros'; // Asegúrate que esta URL sea correcta

  constructor(private http: HttpClient) { }

  getLibros(searchTerm: string = ''): Observable<ILibro[]> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<ILibro[]>(this.apiUrl, { params: params });
  }

  agregarLibro(libro: ICrearLibro): Observable<ILibro> {
    return this.http.post<ILibro>(this.apiUrl, libro);
  }

  actualizarLibro(id: string, cambios: Partial<ILibro>): Observable<ILibro> {
    return this.http.put<ILibro>(`${this.apiUrl}/${id}`, cambios);
  }

  eliminarLibro(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}