import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
// (Debes crear esta interfaz basada en tu modelo de Usuario)
// import { User } from '../interfaces/user.interface'; 

// Esta es la información que leeremos del Token
interface JwtPayload {
  id: string;
  rol: 'Admin' | 'Usuario'; // Asegúrate que coincida con tu Backend
  iat: number;
  exp: number;
}

// Define la URL de tu API de Backend
const API_URL = 'http://localhost:3000/api/auth'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- REQUISITO: Gestión de Estado con Signals ---
  
  // 1. Signal "privado" para el token
  #token = signal<string | null>(localStorage.getItem('authToken'));

  // 2. Signal "computado" (público) que reacciona a los cambios del token
  public isAuthenticated = computed(() => {
    const token = this.#token();
    if (!token) return false;

    // Comprueba si el token ha expirado
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const isExpired = decodedToken.exp < (Date.now() / 1000);
      return !isExpired; // Devuelve true si NO ha expirado
    } catch (error) {
      return false; // Token inválido
    }
  });

  // 3. Signal "computado" (público) para obtener el Rol
  public userRole = computed(() => {
    const token = this.#token();
    if (!this.isAuthenticated() || !token) return null; // Usa el signal anterior

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      return decodedToken.rol; // 'Admin' o 'Usuario'
    } catch (error) {
      return null;
    }
  });

  // --- Métodos del Servicio ---

  login(credentials: { loginIdentifier: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API_URL}/login`, credentials).pipe(
      tap(response => {
        // Cuando el login es exitoso, guardamos el token
        this.saveToken(response.token);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, userData);
  }

  private saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.#token.set(token); // ¡Actualiza el signal!
  }

  getToken(): string | null {
    return this.#token();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.#token.set(null); // ¡Actualiza el signal!
    this.router.navigate(['/login']);
  }
}