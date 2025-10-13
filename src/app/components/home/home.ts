import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  user = signal<any>(null);
  private authSubscription?: Subscription;
  
  juegos = signal([
    {
      nombre: 'Ahorcado',
      descripcion: 'Adivina la palabra antes de que se complete el dibujo',
      icono: 'pi pi-bookmark',
      ruta: '/juegos/ahorcado'
    },
    {
      nombre: 'Mayor o Menor',
      descripcion: 'Adivina si la siguiente carta será mayor o menor',
      icono: 'pi pi-th-large',
      ruta: '/juegos/mayor-menor'
    },
    {
      nombre: 'Preguntados',
      descripcion: 'Responde preguntas sobre imágenes aleatorias',
      icono: 'pi pi-question-circle',
      ruta: '/juegos/preguntados'
    },
    {
      nombre: 'Adivinador de Números',
      descripcion: 'Adivina el número secreto con pistas',
      icono: 'pi pi-calculator',
      ruta: '/juegos/adivinador'
    }
  ]);

  constructor(private auth: Auth, private router: Router, private alertService: AlertService) {
    // Usar authState() observable en el constructor (contexto de inyección)
    this.authSubscription = authState(this.auth).subscribe((user) => {
      this.user.set(user);
      console.log('Usuario actual:', user);
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    // Hook de ciclo de vida vacío - la suscripción ya está en el constructor
  }

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruye
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async logout() {
    const result = await this.alertService.confirm('¿Cerrar sesión?', '¿Estás seguro?');
    if (result.isConfirmed) {
    try {
      await signOut(this.auth);
      this.alertService.success('Sesión cerrada');
      this.router.navigate(['/login']);
    } catch (error) {
      this.alertService.error('Error', 'No se pudo cerrar sesión');
      }
    }
  }

  navegarAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}

