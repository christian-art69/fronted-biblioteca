import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
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
  
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<'Admin' | 'Usuario' | null>(null);
  private userId = new BehaviorSubject<string | null>(null);
  private currentUser = new BehaviorSubject<IUsuario | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  isLoggedIn$ = this.loggedIn.asObservable();
  role$ = this.userRole.asObservable();

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
          this.loggedIn.next(true);
          this.userRole.next(decoded.rol);
          this.userId.next(decoded.id);

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
        this.currentUser.next(usuario);
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
          this.loggedIn.next(true);
          this.userRole.next(decoded.rol);
          this.userId.next(decoded.id);
          this.router.navigate(['/libros']);

          this.fetchAndSetCurrentUser(decoded.id);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.userId.next(null);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }
  
  getRole(): 'Admin' | 'Usuario' | null {
    return this.userRole.value;
  }

  getUserId(): string | null {
    return this.userId.value;
  }
}