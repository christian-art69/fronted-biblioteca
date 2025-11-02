import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importa ReactiveFormsModule
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from './prestamos.service';
import { IPrestamo } from '../interfaces/prestamo.interfaces';
import { IUsuario } from '../interfaces/usuario.interfaces';
import { ILibro } from '../interfaces/libro.interfaces';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../usuarios/usuario.service'; // Para buscar usuarios
import { LibroService } from '../libros/libros.service'; // Para buscar libros

@Component({
  selector: 'app-prestamos',
  standalone: true,
  // 2. Añade ReactiveFormsModule
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './prestamos.html',
  // 3. Importa el CSS de gestión
  styleUrls: ['../panel-gestion.css']
})
export class Prestamos implements OnInit {

  // 4. Inyecta todos los servicios y FormBuilder
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private prestamoService = inject(PrestamoService);
  private usuarioService = inject(UsuarioService);
  private libroService = inject(LibroService);

  public prestamoForm: FormGroup;
  public prestamos: IPrestamo[] = [];
  public mensajeError: string | null = null;
  public mensajeExito: string | null = null;

  // Búsqueda de usuarios y libros
  public filtroUsuario = new FormControl('');
  public filtroLibro = new FormControl('');
  public usuariosEncontrados: IUsuario[] = [];
  public librosEncontrados: ILibro[] = [];
  public usuarioSeleccionado: IUsuario | null = null;
  public libroSeleccionado: ILibro | null = null;

  // 5. Define el formulario de préstamo
  constructor() {
    this.prestamoForm = this.fb.group({
      usuarioId: ['', [Validators.required]],
      libroId: ['', [Validators.required]],
      // Las fechas se calculan en el backend, pero las mantenemos por si acaso
      fechaPrestamo: [new Date().toISOString().split('T')[0], [Validators.required]],
      fechaDevolucion: ['', [Validators.required]]
    });

    // Calcula la fecha de devolución (ej: 7 días)
    const hoy = new Date();
    const fechaDev = new Date(hoy.setDate(hoy.getDate() + 7));
    this.prestamoForm.controls['fechaDevolucion'].setValue(fechaDev.toISOString().split('T')[0]);
  }

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  // 6. Helper para el formulario
  get f() {
    return this.prestamoForm.controls;
  }

  cargarPrestamos(): void {
    const userRole = this.authService.role();
    const userId = this.authService.userId();

    if (userRole === 'Admin') {
      this.prestamoService.getPrestamos().subscribe({
        next: (data) => this.prestamos = data,
        error: (err) => this.mensajeError = 'Error al cargar los préstamos.'
      });
    } else if (userRole === 'Usuario' && userId) {
      this.prestamoService.getPrestamosPorUsuario(userId).subscribe({
        next: (data) => this.prestamos = data,
        error: (err) => this.mensajeError = 'Error al cargar tus préstamos.'
      });
    }
  }

  // --- Funciones para el formulario de admin ---

  buscarUsuario(): void {
    const rut = this.filtroUsuario.value;
    if (!rut) return;
    this.usuarioService.getUsuarioPorRut(rut).subscribe({
      next: (data) => {
        this.usuariosEncontrados = [data]; // Asumimos que getUsuarioPorRut devuelve un solo usuario
        this.seleccionarUsuario(data);
      },
      error: () => {
        this.usuariosEncontrados = [];
        this.usuarioSeleccionado = null;
        this.f['usuarioId'].setValue('');
        alert('Usuario no encontrado.');
      }
    });
  }

  buscarLibro(): void {
    const titulo = this.filtroLibro.value;
    if (!titulo) return;
    this.libroService.buscarLibrosPorTitulo(titulo).subscribe({
      next: (data) => this.librosEncontrados = data,
      error: () => this.librosEncontrados = []
    });
  }

  seleccionarUsuario(usuario: IUsuario): void {
    this.usuarioSeleccionado = usuario;
    this.f['usuarioId'].setValue(usuario._id);
    this.usuariosEncontrados = [];
    this.filtroUsuario.setValue(usuario.rut); // Pone el RUT en el input
  }

  seleccionarLibro(libro: ILibro): void {
    this.libroSeleccionado = libro;
    this.f['libroId'].setValue(libro._id);
    this.librosEncontrados = [];
    this.filtroLibro.setValue(libro.titulo); // Pone el título en el input
  }

  // 7. guardarPrestamo ahora usa el formulario reactivo
  guardarPrestamo(): void {
    if (this.prestamoForm.invalid) {
      this.prestamoForm.markAllAsTouched();
      return;
    }

    this.mensajeError = null;
    this.mensajeExito = null;
    const prestamoData = {
      usuario: this.f['usuarioId'].value,
      libro: this.f['libroId'].value,
      fechaDevolucion: this.f['fechaDevolucion'].value
    };

    this.prestamoService.addPrestamo(prestamoData).subscribe({
      next: () => {
        this.mensajeExito = 'Préstamo registrado exitosamente.';
        this.cargarPrestamos();
        // Limpia el formulario
        this.prestamoForm.reset({
          fechaPrestamo: new Date().toISOString().split('T')[0],
          fechaDevolucion: this.prestamoForm.controls['fechaDevolucion'].value // Mantiene la fecha
        });
        this.filtroUsuario.reset();
        this.filtroLibro.reset();
        this.usuarioSeleccionado = null;
        this.libroSeleccionado = null;
      },
      error: (err) => this.mensajeError = `Error al registrar el préstamo: ${err.error?.message || 'Error desconocido.'}`
    });
  }

  devolverLibro(id: string): void {
    if (confirm('¿Confirmar la devolución de este libro?')) {
      this.prestamoService.devolverPrestamo(id).subscribe({
        next: () => {
          this.mensajeExito = 'Libro devuelto exitosamente.';
          this.cargarPrestamos();
        },
        error: (err) => this.mensajeError = `Error al devolver el libro: ${err.error?.message}`
      });
    }
  }
}