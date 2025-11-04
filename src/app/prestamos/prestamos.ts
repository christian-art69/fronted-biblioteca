import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from './prestamos.service';
import { IPrestamo } from '../interfaces/prestamo.interfaces';
import { IUsuario } from '../interfaces/usuario.interfaces';
import { ILibro } from '../interfaces/libro.interfaces';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { LibroService } from '../libros/libros.service';

@Component({
 selector: 'app-prestamos',
 standalone: true,
 imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
 templateUrl: './prestamos.html',
 styleUrls: ['../panel-gestion.css']
})
export class Prestamos implements OnInit {

 private fb = inject(FormBuilder);
 public authService = inject(AuthService);
 private prestamoService = inject(PrestamoService);
 private usuarioService = inject(UsuarioService);
 private libroService = inject(LibroService);

 public prestamoForm: FormGroup;
 public prestamos: IPrestamo[] = [];
 public mensajeError: string | null = null;
 public mensajeExito: string | null = null;

 public filtroUsuario = new FormControl('');
 public filtroLibro = new FormControl('');
 public usuariosEncontrados: IUsuario[] = [];
 public librosEncontrados: ILibro[] = [];
 public usuarioSeleccionado: IUsuario | null = null;
 public libroSeleccionado: ILibro | null = null;

 constructor() {
 this.prestamoForm = this.fb.group({
 usuarioId: ['', [Validators.required]],
 libroId: ['', [Validators.required]],
 fechaPrestamo: [new Date().toISOString().split('T')[0], [Validators.required]],
 fechaDevolucion: ['', [Validators.required]]
 });
 const hoy = new Date();
 const fechaDev = new Date(hoy.setDate(hoy.getDate() + 7));
 this.prestamoForm.controls['fechaDevolucion'].setValue(fechaDev.toISOString().split('T')[0]);
 }

 ngOnInit(): void {
 this.cargarPrestamos();
 }

 get f() {
 return this.prestamoForm.controls;
 }

 cargarPrestamos(): void {
    this.prestamoService.getPrestamos().subscribe({
      next: (data: any) => this.prestamos = data,
      error: (err: any) => {
        if (this.authService.role() === 'Usuario') {
          this.mensajeError = 'Error al cargar tus préstamos.';
        } else {
          this.mensajeError = 'Error al cargar los préstamos.';
        }
      }
    });
 }

 buscarUsuario(): void {
 const rut = this.filtroUsuario.value;
 if (!rut) return;
 this.usuarioService.getUsuarioPorRut(rut).subscribe({
 next: (data: any) => {
 this.usuariosEncontrados = [data]; 
 this.seleccionarUsuario(data);
 },
 error: (err: any) => {
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
 next: (data: any) => this.librosEncontrados = data,
 error: (err: any) => this.librosEncontrados = []
 });
 }

 seleccionarUsuario(usuario: IUsuario): void {
 this.usuarioSeleccionado = usuario;
 this.f['usuarioId'].setValue(usuario._id);
 this.usuariosEncontrados = [];
 this.filtroUsuario.setValue(usuario.rut);
 }

 seleccionarLibro(libro: ILibro): void {
 this.libroSeleccionado = libro;
 this.f['libroId'].setValue(libro._id);
 this.librosEncontrados = [];
 this.filtroLibro.setValue(libro.titulo);
 }

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
 const fechaDevOriginal = this.f['fechaDevolucion'].value;
 this.prestamoForm.reset({
 fechaPrestamo: new Date().toISOString().split('T')[0],
 fechaDevolucion: fechaDevOriginal 
 });
 this.filtroUsuario.reset();
 this.filtroLibro.reset();
 this.usuarioSeleccionado = null;
 this.libroSeleccionado = null;
 },
 error: (err: any) => this.mensajeError = `Error al registrar el préstamo: ${err.error?.message || 'Error desconocido.'}`
 });
 }

 devolverLibro(id: string): void {
 if (confirm('¿Confirmar la devolución de este libro?')) {
 this.prestamoService.devolverPrestamo(id).subscribe({
 next: () => {
 this.mensajeExito = 'Libro devuelto exitosamente.';
 this.cargarPrestamos();
 },
 error: (err: any) => this.mensajeError = `Error al devolver el libro: ${err.error?.message}`
 });
 }
 }
}