import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsuarioService } from './usuarios/usuario.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'Sistema de Gestion Biblioteca';
  isConnected = false;

  constructor(
    public authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.checkConnection();
  }

  logout() {
    this.authService.logout();
  }

  checkConnection() {
    this.usuarioService.checkConnection().subscribe({
      next: () => {
        this.isConnected = true;
      },
      error: () => {
        this.isConnected = false;
      }
    });
  }
}