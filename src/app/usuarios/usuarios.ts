import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IUsuario } from '../interfaces/usuario.interfaces';
import { UsuarioService } from './usuario.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['../panel-gestion.css']
})
export class Usuarios implements OnInit {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  usuarios: IUsuario[] = [];
  filtro: string = '';
  usuariosFiltrados: IUsuario[] = [];

  public usuarioForm: FormGroup;
  public modalVisible: boolean = false;
  public esModoEdicion: boolean = false;
  public usuarioActualId: string | null = null;
  public mensajeError: string | null = null;
  public mensajeExito: string | null = null;

  roles = ['Admin', 'Usuario'];
  cargos = ['Estudiante', 'Docente', 'Bibliotecario', 'Administrativo'];
  situaciones = ['Vigente', 'Atrasado', 'Bloqueado', 'Prestamo Activo'];

  constructor() {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)]],
      password: ['', [Validators.minLength(6)]],
      rol: ['Usuario', [Validators.required]],
      cargo: ['Estudiante', [Validators.required]],
      situacion: ['Vigente', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get f() {
    return this.usuarioForm.controls;
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.filtrarUsuarios();
      },
      error: (err: any) => this.mensajeError = 'Error al cargar los usuarios.'
    });
  }

  filtrarUsuarios(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(user =>
      user.nombre.toLowerCase().includes(filtroLower) ||
      user.correo.toLowerCase().includes(filtroLower) ||
      user.rut.toLowerCase().includes(filtroLower)
    );
  }

  abrirModalNuevo(): void {
    this.esModoEdicion = false;
    this.modalVisible = true;
    this.usuarioForm.reset({
      rol: 'Usuario',
      cargo: 'Estudiante',
      situacion: 'Vigente'
    });
    this.f['password'].setValidators([Validators.required, Validators.minLength(6)]);
    this.f['password'].updateValueAndValidity();
    this.mensajeError = null;
    this.mensajeExito = null;
  }

  abrirModalEditar(usuario: IUsuario): void {
    this.esModoEdicion = true;
    this.modalVisible = true;
    this.usuarioActualId = usuario._id ?? null;
    this.mensajeError = null;
    this.mensajeExito = null;

    this.f['password'].clearValidators();
    this.f['password'].setValidators([Validators.minLength(6)]);
    this.f['password'].updateValueAndValidity();

    this.usuarioForm.patchValue(usuario);
    this.f['password'].setValue('');
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.usuarioActualId = null;
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.mensajeError = null;
    this.mensajeExito = null;
    let usuarioData = { ...this.usuarioForm.value };

    if (this.esModoEdicion && !usuarioData.password) {
      delete usuarioData.password;
    }

    if (this.esModoEdicion && this.usuarioActualId) {
      this.usuarioService.updateUsuario(this.usuarioActualId, usuarioData).subscribe({
        next: () => {
          this.mensajeExito = 'Usuario actualizado correctamente.';
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (err: any) => this.mensajeError = `Error al actualizar: ${err.error?.message || 'Verifique los datos.'}`
      });
    } else {
      this.authService.register(usuarioData).subscribe({
        next: () => {
          this.mensajeExito = 'Usuario registrado correctamente.';
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (err: any) => this.mensajeError = `Error al registrar: ${err.error?.message || 'Verifique los datos.'}`
      });
    }
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.mensajeExito = 'Usuario eliminado correctamente.';
          this.cargarUsuarios();
        },
        error: (err: any) => this.mensajeError = 'Error al eliminar el usuario.'
      });
    }
  }
}