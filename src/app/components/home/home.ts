import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  user = signal<any>(null);
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

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.user.set(user);
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  navegarAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}

