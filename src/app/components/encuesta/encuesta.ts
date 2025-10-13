import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  Firestore, 
  collection, 
  addDoc,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AlertService } from '../../services/alert';

interface Encuesta {
  usuario: string;
  fecha: Date;
  edad: number;
  juegoFavorito: string;
  calificacion: number;
  sugerencias: string;
  volveriaJugar: string;
  recomendaria: string;
}

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css'
})
export class EncuestaComponent implements OnInit {
  yaRespondioEncuesta = signal(false);
  cargando = signal(false);
  
  // Formulario
  edad = signal<number | null>(null);
  juegoFavorito = signal('');
  calificacion = signal(0);
  sugerencias = signal('');
  volveriaJugar = signal('');
  recomendaria = signal('');
  
  juegosDisponibles = [
    'Ahorcado',
    'Mayor o Menor',
    'Preguntados',
    'Adivinador de Números'
  ];

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private alertService: AlertService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    await this.verificarEncuestaExistente();
  }
  
  async verificarEncuestaExistente() {
    const user = this.auth.currentUser;
    if (!user) return;
    
    const encuestasCollection = collection(this.firestore, 'encuestas');
    const q = query(encuestasCollection, where('usuario', '==', user.email));
    const querySnapshot = await getDocs(q);
    
    this.yaRespondioEncuesta.set(!querySnapshot.empty);
  }
  
  async enviarEncuesta() {
    // Validaciones
    if (!this.edad() || this.edad()! < 10 || this.edad()! > 120) {
      await this.alertService.warning('Atención', 'Ingresa una edad válida');
      return;
    }
    
    if (!this.juegoFavorito()) {
      await this.alertService.warning('Atención', 'Selecciona tu juego favorito');
      return;
    }
    
    if (this.calificacion() === 0) {
      await this.alertService.warning('Atención', 'Selecciona una calificación');
      return;
    }
    
    if (!this.volveriaJugar() || !this.recomendaria()) {
      await this.alertService.warning('Atención', 'Completa todas las preguntas obligatorias');
      return;
    }
    
    this.cargando.set(true);
    
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');
      
      const encuesta: Encuesta = {
        usuario: user.email || 'Anónimo',
        fecha: new Date(),
        edad: this.edad()!,
        juegoFavorito: this.juegoFavorito(),
        calificacion: this.calificacion(),
        sugerencias: this.sugerencias(),
        volveriaJugar: this.volveriaJugar(),
        recomendaria: this.recomendaria()
      };
      
      const encuestasCollection = collection(this.firestore, 'encuestas');
      await addDoc(encuestasCollection, encuesta);
      
      await this.alertService.success('¡Gracias!', 'Tu encuesta ha sido enviada');
      this.yaRespondioEncuesta.set(true);
    } catch (error) {
      console.error('Error al enviar encuesta:', error);
      await this.alertService.error('Error', 'No se pudo enviar la encuesta');
    } finally {
      this.cargando.set(false);
    }
  }
  
  setCalificacion(valor: number) {
    this.calificacion.set(valor);
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}
