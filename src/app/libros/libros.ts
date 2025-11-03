import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ILibro } from '../interfaces/libro.interfaces';
import { LibroService } from './libros.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libros.html',
  styleUrls: ['../panel-gestion.css'] 
})
export class Libros implements OnInit {

  private fb = inject(FormBuilder);
  private libroService = inject(LibroService);
  public authService = inject(AuthService);

  libros: ILibro[] = [];
  filtro: string = '';
  librosFiltrados: ILibro[] = [];
  
  public libroForm: FormGroup;
  public modalVisible: boolean = false;
  public esModoEdicion: boolean = false;
  public libroActualId: string | null = null;
  public mensajeError: string | null = null;
  public mensajeExito: string | null = null;
  
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

  get f() {
    return this.libroForm.controls;
  }

  cargarLibros(): void {
    this.libroService.getLibros().subscribe({
      next: (data: any) => {
        this.libros = data;
        this.filtrarLibros();
      },
      error: (err: any) => this.mensajeError = 'Error al cargar los libros.'
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
    this.libroForm.patchValue(libro);
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.libroActualId = null;
  }

  guardarLibro(): void {
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched();
      return;
    }

    this.mensajeError = null;
    this.mensajeExito = null;
    const libroData = this.libroForm.value;

    if (this.esModoEdicion && this.libroActualId) {
      this.libroService.updateLibro(this.libroActualId, libroData).subscribe({
        next: () => {
          this.mensajeExito = 'Libro actualizado correctamente.';
          this.cargarLibros();
          this.cerrarModal();
        },
        error: (err: any) => this.mensajeError = 'Error al actualizar el libro.'
      });
    } else {
      this.libroService.addLibro(libroData).subscribe({
        next: () => {
          this.mensajeExito = 'Libro agregado correctamente.';
          this.cargarLibros();
          this.cerrarModal();
        },
        error: (err: any) => this.mensajeError = 'Error al agregar el libro.'
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
        error: (err: any) => this.mensajeError = 'Error al eliminar el libro.'
      });
    }
  }
}