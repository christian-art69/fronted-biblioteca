import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa lo necesario para Formularios Reactivos
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // 1. Quita FormsModule y añade ReactiveFormsModule
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // 2. Añadiremos este archivo CSS nuevo
})
export class Login {
  // 3. Inyecta FormBuilder
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm: FormGroup;
  public errorMessage: string | null = null;

  constructor() {
    // 4. Define el formulario en el constructor con validadores
    this.loginForm = this.fb.group({
      loginIdentifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 5. Método de login actualizado para usar el formulario reactivo
  login() {
    if (this.loginForm.invalid) {
      // Marca todos los campos como "tocados" para mostrar errores
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const { loginIdentifier, password } = this.loginForm.value;

    this.authService.login(loginIdentifier, password).subscribe({
      next: () => {
        // La navegación al home la maneja el servicio
      },
      error: (err) => {
        console.error('Error de login:', err);
        // 6. Manejo de error más claro
        this.errorMessage = 'Usuario o contraseña incorrectos. Por favor, intente de nuevo.';
      }
    });
  }

  // 7. Helpers para acceder fácilmente a los controles del formulario en el HTML
  get f() {
    return this.loginForm.controls;
  }
}