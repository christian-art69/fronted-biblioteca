import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { User } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'MongoDB + Angular App';
  users: User[] = [];
  newUser: User = { nombreCompleto: '', email: '', edad: 0, activo: true };
  isConnected = false;
  loading = false;
  message = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.checkConnection();
    this.loadUsers();
  }

  // Verificar conexión con el backend
  checkConnection() {
    this.userService.checkConnection().subscribe({
      next: (response) => {
        this.isConnected = true;
        console.log('✅ Conexión exitosa:', response);
      },
      error: (error) => {
        this.isConnected = false;
        console.error('❌ Error de conexión:', error);
      }
    });
  }

  // Cargar todos los usuarios
  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.message = `${users.length} usuarios cargados`;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.loading = false;
        this.message = 'Error cargando usuarios';
      }
    });
  }

  // Crear nuevo usuario
  createUser() {
    if (!this.newUser.nombreCompleto || !this.newUser.email) {
      this.message = 'Nombre completo y email son requeridos';
      return;
    }

    this.loading = true;
    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        this.users.unshift(user);
        this.newUser = { nombreCompleto: '', email: '', edad: 0, activo: true };
        this.loading = false;
        this.message = 'Usuario creado exitosamente';
      },
      error: (error) => {
        console.error('Error creando usuario:', error);
        this.loading = false;
        this.message = 'Error creando usuario';
      }
    });
  }

  // Eliminar usuario
  deleteUser(id: string) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user._id !== id);
        this.message = 'Usuario eliminado exitosamente';
      },
      error: (error) => {
        console.error('Error eliminando usuario:', error);
        this.message = 'Error eliminando usuario';
      }
    });
  }

  // Alternar estado activo del usuario
  toggleUserStatus(user: User) {
    if (!user._id) return;

    const updatedUser = { ...user, activo: !user.activo };
    
    this.userService.updateUser(user._id, updatedUser).subscribe({
      next: (updated) => {
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          this.users[index] = updated;
        }
        this.message = `Usuario ${updated.activo ? 'activado' : 'desactivado'} exitosamente`;
      },
      error: (error) => {
        console.error('Error actualizando usuario:', error);
        this.message = 'Error actualizando usuario';
      }
    });
  }
}