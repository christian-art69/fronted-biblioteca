import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibroService } from '../libros/libro.service';
import { ILibro, ICrearLibro } from '../interfaces/libro.interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrls: ['./libros.css', '../panel-gestion.css']
})
export class Libros implements OnInit { 
  libros: ILibro[] = [];
  nuevoLibro: ICrearLibro = {
    titulo: '',
    autor: '',
    genero: '',
    ano: null,
    cantidad: 1
  };
  terminoBusqueda: string = '';
  esAdmin: boolean = false;
  libroSeleccionado: ILibro | null = null;
  
  constructor(private libroService: LibroService, private authService: AuthService) {}

  ngOnInit(): void {
    this.esAdmin = (this.authService.getRole() === 'Admin');
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.getLibros(this.terminoBusqueda).subscribe({
      next: (data) => {
        this.libros = data;
        console.log('Libros cargados exitosamente:', this.libros);
      },
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  agregarLibro(): void {
    this.libroService.agregarLibro(this.nuevoLibro).subscribe({
      next: (libroGuardado) => {
        this.libros.push(libroGuardado);
        this.nuevoLibro = { titulo: '', autor: '', genero: '', ano: null, cantidad: 1 };
      },
      error: (err) => console.error('Error al agregar el libro:', err)
    });
  }

  editarLibro(libro: ILibro): void {
    this.libroSeleccionado = { ...libro };
  }

  cerrarModal(): void {
    this.libroSeleccionado = null;
  }

  guardarCambios(): void {
    if (!this.libroSeleccionado) return;
    const { _id, ...cambios } = this.libroSeleccionado;

    this.libroService.actualizarLibro(_id, cambios).subscribe({
      next: (libroActualizado) => {
        const index = this.libros.findIndex(l => l._id === libroActualizado._id);
        if (index !== -1) { this.libros[index] = libroActualizado; }
        this.cerrarModal();
      },
      error: (err) => console.error('Error al guardar los cambios:', err)
    });
  }

  eliminarLibro(libro: ILibro): void {
    if (confirm(`¿Estás seguro de eliminar "${libro.titulo}"?`)) {
      this.libroService.eliminarLibro(libro._id).subscribe({
        next: () => {
          this.libros = this.libros.filter(l => l._id !== libro._id);
        },
        error: (err) => console.error('Error al eliminar libro', err)
      });
    }
  }
}