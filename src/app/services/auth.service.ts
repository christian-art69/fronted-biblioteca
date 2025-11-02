// CÓDIGO ACTUALIZADO
import { Injectable, signal, WritableSignal, Signal } from '@angular/core'; // Importa 'signal', 'WritableSignal' y 'Signal'
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // Ya no se necesita BehaviorSubject
import { Usuario } from '../interfaces/usuario.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://backend-biblioteca-u4k0.onrender.com';

  // --- Reemplaza BehaviorSubject por signal() ---
  private loggedInSignal: WritableSignal<boolean> = signal(this.hasToken());
  private userRoleSignal: WritableSignal<string | null> = signal(this.getRole());

  // --- Expone señales de solo lectura (Readonly) ---
  public isLoggedIn: Signal<boolean> = this.loggedInSignal.asReadonly();
  public userRole: Signal<string | null> = this.userRoleSignal.asReadonly();

  constructor(private http: HttpClient) { }

  login(usuario: string, clave: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { usuario, clave }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('userId', response.userId); 
          
          // --- Reemplaza .next() por .set() ---
          this.loggedInSignal.set(true);
          this.userRoleSignal.set(response.role);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId'); 
    
    // --- Reemplaza .next() por .set() ---
    this.loggedInSignal.set(false);
    this.userRoleSignal.set(null);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  register(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios`, usuario);
  }
}