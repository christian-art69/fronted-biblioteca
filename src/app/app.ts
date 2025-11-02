import { Component, inject, Signal } from '@angular/core'; // Importa inject y Signal
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
// Ya no se necesita Observable

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // Inyecta los servicios de forma moderna
  private authService = inject(AuthService);
  private router = inject(Router);

  // Asigna las señales directamente
  isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;
  userRole: Signal<string | null> = this.authService.userRole;

  // El constructor ya no es necesario para la inyección

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}