import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../prestamos/prestamos.service';
import { IPrestamo } from '../interfaces/prestamo.interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './historial.html',
  // 1. Añade los estilos
  styleUrls: ['../panel-gestion.css']
})
export class Historial implements OnInit {
  
  public authService = inject(AuthService);
  private prestamoService = inject(PrestamoService);

  historial: IPrestamo[] = [];
  mensajeError: string | null = null;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const userRole = this.authService.role();
    const userId = this.authService.userId();

    if (userRole === 'Admin') {
      // 2. Añade tipo 'any'
      this.prestamoService.getHistorial().subscribe({
        next: (data: any) => this.historial = data,
        error: (err: any) => this.mensajeError = 'Error al cargar el historial.'
      });
    } else if (userRole === 'Usuario' && userId) {
      // 3. Añade tipo 'any'
      this.prestamoService.getHistorialPorUsuario(userId).subscribe({
        next: (data: any) => this.historial = data,
        error: (err: any) => this.mensajeError = 'Error al cargar tu historial.'
      });
    }
  }
}