import { Injectable, signal, WritableSignal, Signal } from '@angular/core'; // Importamos Signals
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { UsuarioService } from '../usuarios/usuario.service';
import { IUsuario } from '../interfaces/usuario.interfaces';

interface JwtPayload {
  id: string;
  rol: 'Admin' | 'Usuario';
  iat: number;
  exp: number;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://backend-biblioteca-u4k0.onrender.com/api/auth';
  
  // --- CAMBIO A SIGNALS ---
  // Reemplazamos los BehaviorSubject por WritableSignal (privados)
  private loggedInSignal = signal<boolean>(this.hasToken());
  private userRoleSignal = signal<'Admin' | 'Usuario' | null>(null);
  private userIdSignal = signal<string | null>(null);
  private currentUserSignal = signal<IUsuario | null>(null);

  // Exponemos Signals de solo lectura (públicos)
  // Nota: Los nombres ya no terminan en '$'
  public isLoggedIn: Signal<boolean> = this.loggedInSignal.asReadonly();
  public role: Signal<'Admin' | 'Usuario' | null> = this.userRoleSignal.asReadonly();
  public userId: Signal<string | null> = this.userIdSignal.asReadonly();
  public currentUser: Signal<IUsuario | null> = this.currentUserSignal.asReadonly();
  // --- FIN DEL CAMBIO ---

  constructor(
    private router: Router,
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {
    this.checkTokenAndSetRole();
  }

  private checkTokenAndSetRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          // Usamos .set() para actualizar los signals
          this.loggedInSignal.set(true);
          this.userRoleSignal.set(decoded.rol);
          this.userIdSignal.set(decoded.id);

          this.fetchAndSetCurrentUser(decoded.id);

        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private fetchAndSetCurrentUser(id: string) {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.currentUserSignal.set(usuario); // Usamos .set()
      },
      error: (err) => {
        console.error("No se pudo cargar la info del usuario, cerrando sesión.", err);
        this.logout(); 
      }
    });
  }

  login(loginIdentifier: string, password: string) {
    
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { loginIdentifier, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const decoded = jwtDecode<JwtPayload>(response.token);
          
          // Usamos .set() para actualizar los signals
          this.loggedInSignal.set(true);
          this.userRoleSignal.set(decoded.rol);
          this.userIdSignal.set(decoded.id);
          this.router.navigate(['/libros']);

          this.fetchAndSetCurrentUser(decoded.id);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    
    // Usamos .set() para actualizar los signals a null/false
    this.loggedInSignal.set(false);
    this.userRoleSignal.set(null);
    this.userIdSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
  
  getRole(): 'Admin' | 'Usuario' | null {
    return this.userRoleSignal(); // Leemos el valor actual del signal
  }

  getUserId(): string | null {
    return this.userIdSignal(); // Leemos el valor actual del signal
  }
}