import { Injectable, signal, WritableSignal, Signal, inject, Injector } from '@angular/core'; // 1. IMPORTA INJECTOR
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  private loggedInSignal = signal<boolean>(this.hasToken());
  private userRoleSignal = signal<'Admin' | 'Usuario' | null>(null);
  private userIdSignal = signal<string | null>(null);
  private currentUserSignal = signal<IUsuario | null>(null);

  public isLoggedIn: Signal<boolean> = this.loggedInSignal.asReadonly();
  public role: Signal<'Admin' | 'Usuario' | null> = this.userRoleSignal.asReadonly();
  public userId: Signal<string | null> = this.userIdSignal.asReadonly();
  public currentUser: Signal<IUsuario | null> = this.currentUserSignal.asReadonly();

  private router = inject(Router);
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private _usuarioService: UsuarioService | undefined;
  private get usuarioService(): UsuarioService {
    if (!this._usuarioService) {
      this._usuarioService = this.injector.get(UsuarioService);
    }
    return this._usuarioService;
  }

  constructor() {
    this.checkTokenAndSetRole();
  }

  private checkTokenAndSetRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
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
      next: (usuario: IUsuario) => {
        this.currentUserSignal.set(usuario);
      },
      error: (err: any) => {
        console.error("No se pudo cargar la info del usuario, cerrando sesión.", err);
        this.logout();
      }
    });
  }

  login(loginIdentifier: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { loginIdentifier, password })
      .pipe(
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token);
          const decoded = jwtDecode<JwtPayload>(response.token);

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
    this.loggedInSignal.set(false);
    this.userRoleSignal.set(null);
    this.userIdSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getRole(): 'Admin' | 'Usuario' | null {
    return this.userRoleSignal();
  }

  getUserId(): string | null {
    return this.userIdSignal();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  register(usuario: IUsuario): Observable<any> {
    const registerUrl = this.apiUrl.replace('/auth', '/usuarios/register');
    return this.http.post<any>(registerUrl, usuario);
  }
}