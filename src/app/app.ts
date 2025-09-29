import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sala-de-juegos');

  // Método para obtener el usuario actual
  user(): any {
    // Por ahora retorna null, más adelante puedes integrar con un servicio de autenticación
    return null;
  }

  // Método para logout (referenciado en el template comentado)
  logout(): void {
    // Implementar lógica de logout más adelante
    console.log('Logout');
  }
}
