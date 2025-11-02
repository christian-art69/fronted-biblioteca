import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { PrestamoService } from '../prestamos/prestamo.service';
import { LibroService } from '../libros/libro.service';
import { UsuarioService } from '../usuarios/usuario.service';

import { IPrestamo, ICrearPrestamo } from '../interfaces/prestamo.interfaces';
import { ILibro } from '../interfaces/libro.interfaces';
import { IUsuario } from '../interfaces/usuario.interfaces';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrls: ['./prestamos.css', '../panel-gestion.css']
})
export class Prestamos implements OnInit {
  prestamos: IPrestamo[] = [];
  libros: ILibro[] = [];
  usuarios: IUsuario[] = [];

  nuevoPrestamo: ICrearPrestamo = {
    usuario: '',
    libro: '',
    fechaPrestamo: null,
    fechaDevolucion: null
  };
  esAdmin: boolean = false;
  miId: string | null = null;

  constructor(private prestamoService: PrestamoService, 
    private libroService: LibroService,
    private usuarioService: UsuarioService,
    private authService: AuthService) {}
  
  ngOnInit(): void {
    this.esAdmin = (this.authService.getRole() === 'Admin');
    this.miId = this.authService.getUserId();
    this.cargarPrestamos();
    if (this.esAdmin) {
      this.cargarLibros();
      this.cargarUsuarios();
    }
  }

  cargarPrestamos(): void {
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        if (this.esAdmin) {
          this.prestamos = data;
        } else {
          this.prestamos = data.filter(prestamo => prestamo.usuario._id === this.miId);
        }
      },
      error: (err) => console.error('Error al cargar Prestamos', err)
    });
  }

  cargarLibros(): void {
    this.libroService.getLibros().subscribe(data => this.libros = data);
  }
  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(data => this.usuarios = data);
  }

  get librosDisponibles(): ILibro[] {
    return this.libros.filter(l => l.cantidad > 0);
  }

  get usuarioSeleccionado(): IUsuario | undefined {
    if (!this.nuevoPrestamo.usuario) {
      return undefined;
    }
    return this.usuarios.find(u => u._id === this.nuevoPrestamo.usuario);
  }
  get puedeRegistrar(): boolean {
    if (!this.nuevoPrestamo.usuario) {
      return false;
    }
    
    const usuarioSeleccionado = this.usuarios.find(u => u._id === this.nuevoPrestamo.usuario);
    
    if (!usuarioSeleccionado) {
      return false;
    }
    
    return usuarioSeleccionado.situacion === 'Vigente';
  }

  registrarPrestamo(): void {
      this.prestamoService.registrarPrestamo(this.nuevoPrestamo).subscribe({
        next: (prestamoGuardado) => {
          this.prestamos.push(prestamoGuardado); 
          
          this.cargarUsuarios();
          this.cargarLibros();

          this.nuevoPrestamo = { usuario: '', libro: '', fechaPrestamo: null, fechaDevolucion: null };
        },
        error: (err) => console.error('Error al registrar el prestamo', err)
      });
    }

  marcarDevuelto(prestamo: IPrestamo): void {
    const observacion = window.prompt('Añadir observación sobre la devolución (opcional):');

    if (observacion === null) {
      return;
    }

    this.prestamoService.marcarDevuelto(prestamo._id, observacion).subscribe({
      next: () => {
        this.prestamos = this.prestamos.filter(p => p._id !== prestamo._id);
        this.cargarUsuarios(); 
        this.cargarLibros();
      },
      error: (err: any) => console.error('Error al devolver el préstamo', err)
    });
  }

  eliminarPrestamo(prestamo: IPrestamo): void {
    if (!confirm(`¿ELIMINAR el préstamo de "${prestamo.libro.titulo}"? (Esta acción es para corregir errores y NO se guardará en el historial)`)) {
      return;
    }

    this.prestamoService.eliminarPrestamo(prestamo._id).subscribe({
      next: () => {
        this.prestamos = this.prestamos.filter(p => p._id !== prestamo._id);
        this.cargarUsuarios(); 
        this.cargarLibros();
      },
      error: (err: any) => console.error('Error al eliminar el préstamo', err)
    });
  }

  calcularEstadoPrestamo(fechaDevolucionISO: string | Date | undefined): string {
    if (!fechaDevolucionISO) {
      return '';
    }
    
    const hoy = new Date();
    const fechaEntrega = new Date(fechaDevolucionISO);
    
    hoy.setHours(0, 0, 0, 0);
    fechaEntrega.setHours(0, 0, 0, 0);
    
    const diffTime = fechaEntrega.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Atrasado por ${Math.abs(diffDays)} día(s)`;
    }
    if (diffDays === 0) {
      return '¡Entrega hoy!';
    }
    if (diffDays <= 3) { 
      return `Faltan ${diffDays} día(s)`;
    }
    
    return 'En plazo';
  }
}
