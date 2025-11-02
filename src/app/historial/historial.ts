import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../prestamos/prestamo.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css', '../panel-gestion.css']
})

export class Historial implements OnInit {

  historial: any[] = [];
  esAdmin: boolean = false;
  miId: string | null = null;

  constructor(
    private prestamoService: PrestamoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = (this.authService.getRole() === 'Admin');
    this.miId = this.authService.getUserId();

    this.prestamoService.getHistorial().subscribe({
      next: (data) => {
        if (this.esAdmin) {
          this.historial = data;
        } else {
          this.historial = data.filter(h => h.usuario._id === this.miId);
        }
      },
      error: (err) => console.error('Error al cargar el historial', err)
    });
  }
}