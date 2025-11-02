import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa ReactiveFormsModule, FormBuilder, Validators y FormGroup
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ILibro } from '../interfaces/libro.interfaces';
import { LibroService } from './libros.service';
import { AuthService } from '../services/auth.service'; // Importar AuthService

@Component({
  selector: 'app-libros',
  standalone: true,
  // 1. Añade ReactiveFormsModule
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './libros.html',
  // 2. Importa el CSS de gestión
  styleUrls: ['../panel-gestion.css'] 
})
export class Libros implements OnInit {

  // 3. Inyecta FormBuilder y servicios
  private fb = inject(FormBuilder);
  private libroService = inject(LibroService);
  public authService = inject(AuthService); // Público para usarlo en el template

  libros: ILibro[] = [];
  filtro: string = '';
  librosFiltrados: ILibro[] = [];
  
  public libroForm: FormGroup;
  public modalVisible: boolean = false;
  public esModoEdicion: boolean = false;
  public libroActualId: string | null = null;
  public mensajeError: string | null = null;
  public mensajeExito: string | null = null;
  
  // 4. Define el formulario reactivo
  constructor() {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', [Validators.required]],
      ano: [null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      cantidad: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarLibros();
  }

  // 5. Helper para acceder a los controles del formulario
  get f() {
    return this.libroForm.controls;
  }

  cargarLibros(): void {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.filtrarLibros();
      },
      error: (err) => this.mensajeError = 'Error al cargar los libros.'
    });
  }

  filtrarLibros(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.librosFiltrados = this.libros.filter(libro => 
      libro.titulo.toLowerCase().includes(filtroLower) ||
      libro.autor.toLowerCase().includes(filtroLower) ||
      libro.genero.toLowerCase().includes(filtroLower)
    );
  }

  abrirModalNuevo(): void {
    this.esModoEdicion = false;
    this.modalVisible = true;
    this.libroForm.reset();
    this.mensajeError = null;
    this.mensajeExito = null;
  }

  abrirModalEditar(libro: ILibro): void {
    this.esModoEdicion = true;
    this.modalVisible = true;
    this.libroActualId = libro._id ?? null;
    this.mensajeError = null;
    this.mensajeExito = null;
    // 6. Usa patchValue para cargar datos en el formulario
    this.libroForm.patchValue(libro);
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.libroActualId = null;
  }

  // 7. guardarLibro ahora usa el formulario reactivo
  guardarLibro(): void {
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched(); // Muestra errores si se intenta guardar
      return;
    }

    this.mensajeError = null;
    this.mensajeExito = null;
    const libroData = this.libroForm.value;

    if (this.esModoEdicion && this.libroActualId) {
      // Modo Edición
      this.libroService.updateLibro(this.libroActualId, libroData).subscribe({
        next: () => {
          this.mensajeExito = 'Libro actualizado correctamente.';
          this.cargarLibros();
          this.cerrarModal();
        },
        error: (err) => this.mensajeError = 'Error al actualizar el libro.'
      });
    } else {
      // Modo Creación
      this.libroService.addLibro(libroData).subscribe({
        next: () => {
          this.mensajeExito = 'Libro agregado correctamente.';
          this.cargarLibros();
          this.cerrarModal();
        },
        error: (err) => this.mensajeError = 'Error al agregar el libro.'
      });
    }
  }

  eliminarLibro(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este libro?')) {
      this.libroService.deleteLibro(id).subscribe({
        next: () => {
          this.mensajeExito = 'Libro eliminado correctamente.';
          this.cargarLibros();
        },
        error: (err) => this.mensajeError = 'Error al eliminar el libro.'
      });
    }
  }
}