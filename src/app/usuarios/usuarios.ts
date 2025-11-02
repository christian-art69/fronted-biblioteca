import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { IUsuario, ICrearUsuario} from '../interfaces/usuario.interfaces';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css', '../panel-gestion.css']
})
export class Usuarios implements OnInit {
  usuarios: IUsuario[] = [];
  nuevoUsuario: ICrearUsuario = {
    nombre: '',
    correo: '',
    rut: '',
    rol: 'Usuario',
    password: '',
    cargo: 'Estudiante'
  };
  terminoBusqueda: string = '';
  usuarioSeleccionado: IUsuario | null = null;
  nuevaPasswordModal: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }
  
  cargarUsuarios(): void {
    this.usuarioService.getUsuarios(this.terminoBusqueda).subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados exitosamente:', this.usuarios);
      },
      error: (err) => console.error('Error al cargar Usuarios:', err)
    });
  }

  registrarUsuario() {
    this.usuarioService.registrarUsuario(this.nuevoUsuario).subscribe({
      next: (usuarioGuardado) => {
        this.usuarios.push(usuarioGuardado);
        this.nuevoUsuario = {
          nombre: '',
          correo: '',
          rut: '',
          rol: 'Usuario',
          password: '',
          cargo: 'Estudiante'
        };
      },
      error: (err) => console.error('Error al registrar el usuario', err)
    });
  }

  editarUsuario(usuario: IUsuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.nuevaPasswordModal = '';
  }
  cerrarModal(): void {
    this.usuarioSeleccionado = null;
  }
  guardarCambios(): void {
      if (!this.usuarioSeleccionado) return;

      const cambios: Partial<IUsuario> & { password?: string } = {
        ...this.usuarioSeleccionado
      };

      if (this.nuevaPasswordModal.trim() !== '') {
        cambios.password = this.nuevaPasswordModal;
      }

      this.usuarioService.updateUsuario(this.usuarioSeleccionado._id, cambios).subscribe({
        next: (usuarioActualizado) => {
          const index = this.usuarios.findIndex(u => u._id === usuarioActualizado._id);
          if (index !== -1) {
            this.usuarios[index] = usuarioActualizado;
          }
          this.cerrarModal();
        },
        error: (err) => console.error('Error al guardar los cambios', err)
      });
    }

  eliminarUsuario(usuario: any) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${usuario.titulo}"?`)) {
      this.usuarioService.eliminarUsuario(usuario._id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(l => l._id !== usuario._id);
        },
        error: (err) => console.error('Error al eliminar el usuario:', err)
      });
    }
  }
}
