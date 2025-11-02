import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuario, ICrearUsuario } from '../interfaces/usuario.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/usuarios';
  
  private healthUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/health';


  constructor(private http: HttpClient) { }

  getUsuarios(searchTerm: string = ''): Observable<IUsuario[]> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<IUsuario[]>(this.apiUrl, { params: params });
  }

  getUsuarioById(id: string): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this.apiUrl}/${id}`);
  }

  registrarUsuario(usuario: ICrearUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: string, cambios: Partial<IUsuario> & { password?: string }): Observable<IUsuario> {
    return this.http.put<IUsuario>(`${this.apiUrl}/${id}`, cambios);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkConnection(): Observable<any> {
    return this.http.get(this.healthUrl);
  }
}