import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPrestamo, ICrearPrestamo } from '../interfaces/prestamo.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/prestamos';

  constructor(private http: HttpClient) { }

  getPrestamos(): Observable<IPrestamo[]> {
    return this.http.get<IPrestamo[]>(this.apiUrl);
  }

  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }

  registrarPrestamo(prestamo: ICrearPrestamo): Observable<IPrestamo> {
    return this.http.post<IPrestamo>(this.apiUrl, prestamo);
  }

  marcarDevuelto(id: string, observacion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/devolver/${id}`, { observaciones: observacion });
  }

    eliminarPrestamo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }
}