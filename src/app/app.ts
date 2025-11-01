import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Importa RouterOutlet
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'fronted-biblioteca';
  
  // ¡Este componente debe estar limpio!
  // La lógica de login, usuarios, etc., va en los "Servicios".
}