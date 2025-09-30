import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('sala-de-juegos');
  private userSignal = signal<any>(null);
  private authSubscription?: Subscription;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authSubscription = authState(this.auth).subscribe((user) => {
      this.userSignal.set(user);
      console.log('Estado de autenticación actualizado:', user?.email || 'Sin usuario');
    });
  }

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruye
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Método para obtener el usuario actual
  user(): any {
    return this.userSignal();
  }

  // Método para logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
