import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usuario = '';
  clave = '';
  mensaje = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.usuario, this.clave).subscribe({
      next: () => {
        this.mensaje = '¡Bienvenido!';
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al iniciar sesión';
      }
    });
  }
}