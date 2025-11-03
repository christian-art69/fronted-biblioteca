import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm: FormGroup;
  public errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      loginIdentifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const { loginIdentifier, password } = this.loginForm.value;

    this.authService.login(loginIdentifier, password).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos. Por favor, intente de nuevo.';
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}