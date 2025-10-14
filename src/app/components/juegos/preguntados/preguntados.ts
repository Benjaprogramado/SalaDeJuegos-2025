import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JuegosService } from '../../../services/juegos';
import { AlertService } from '../../../services/alert';
import { HttpClient } from '@angular/common/http';

interface Pregunta {
  imagen: string;
  pregunta: string;
  respuestas: string[];
  respuestaCorrecta: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class PreguntadosComponent implements OnInit {
  preguntaActual = signal<Pregunta | null>(null);
  respuestaSeleccionada = signal('');
  puntaje = signal(0);
  preguntaNumero = signal(1);
  totalPreguntas = signal(5);
  juegoTerminado = signal(false);
  mostrarResultado = signal(false);
  esCorrecta = signal(false);
  cargando = signal(false);
  
  // Lista de razas obtenida de la API
  private todasLasRazas: string[] = [];

  constructor(
    private http: HttpClient,
    private juegosService: JuegosService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.iniciarJuego();
  }
  
  async iniciarJuego() {
    this.puntaje.set(0);
    this.preguntaNumero.set(1);
    this.juegoTerminado.set(false);
    await this.cargarPregunta();
  }
  
  async cargarPregunta() {
    this.cargando.set(true);
    this.mostrarResultado.set(false);
    this.respuestaSeleccionada.set('');

    try {
      // Si no tenemos razas cargadas, las obtenemos primero
      if (this.todasLasRazas.length === 0) {
        const breedsResponse: any = await this.http.get('https://dog.ceo/api/breeds/list/all').toPromise();
        // Convertir el objeto de razas a un array
        this.todasLasRazas = Object.keys(breedsResponse.message).map(breed => 
          breed.charAt(0).toUpperCase() + breed.slice(1).replace('-', ' ')
        );
      }
      
      // Elegir una raza aleatoria como respuesta correcta
      const indiceRazaCorrecta = Math.floor(Math.random() * this.todasLasRazas.length);
      const razaCorrecta = this.todasLasRazas[indiceRazaCorrecta];
      const razaCorrectaSlug = razaCorrecta.toLowerCase().replace(' ', '-');
      
      // Obtener una imagen de esa raza específica
      const imageResponse: any = await this.http.get(
        `https://dog.ceo/api/breed/${razaCorrectaSlug}/images/random`
      ).toPromise();
      
      // Elegir 3 razas incorrectas aleatorias
      const respuestasIncorrectas: string[] = [];
      while (respuestasIncorrectas.length < 3) {
        const indiceAleatorio = Math.floor(Math.random() * this.todasLasRazas.length);
        const razaAleatoria = this.todasLasRazas[indiceAleatorio];
        
        // Asegurarse de que no sea la correcta y no esté ya en las incorrectas
        if (razaAleatoria !== razaCorrecta && !respuestasIncorrectas.includes(razaAleatoria)) {
          respuestasIncorrectas.push(razaAleatoria);
        }
      }
      
      // Mezclar todas las respuestas
      const todasRespuestas = [razaCorrecta, ...respuestasIncorrectas]
        .sort(() => Math.random() - 0.5);

      this.preguntaActual.set({
        imagen: imageResponse.message,
        pregunta: '¿Qué raza de perro es este?',
        respuestas: todasRespuestas,
        respuestaCorrecta: razaCorrecta
      });
    } catch (error) {
      console.error('Error al cargar pregunta:', error);
      // Fallback en caso de error
      this.preguntaActual.set({
        imagen: 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg',
        pregunta: '¿Qué raza de perro es este?',
        respuestas: ['Afghan Hound', 'Greyhound', 'Saluki', 'Whippet'],
        respuestaCorrecta: 'Afghan Hound'
      });
    }
    
    this.cargando.set(false);
  }
  
  async verificarRespuesta() {
    if (!this.respuestaSeleccionada()) {
      await this.alertService.warning('Atención', 'Debes seleccionar una respuesta');
      return;
    }

    this.mostrarResultado.set(true);
    
    const esCorrecta = this.respuestaSeleccionada().toLowerCase() === 
                       this.preguntaActual()!.respuestaCorrecta.toLowerCase();
    
    this.esCorrecta.set(esCorrecta);
    
    if (esCorrecta) {
      this.puntaje.update(p => p + 20);
    }
    
    setTimeout(() => {
      this.siguientePregunta();
    }, 2000);
  }
  
  async siguientePregunta() {
    if (this.preguntaNumero() >= this.totalPreguntas()) {
      await this.finalizarJuego();
    } else {
      this.preguntaNumero.update(n => n + 1);
      await this.cargarPregunta();
    }
  }
  
  async finalizarJuego() {
    this.juegoTerminado.set(true);
    
    await this.juegosService.guardarResultado('Preguntados', this.puntaje(), {
      preguntasCorrectas: this.puntaje() / 20,
      totalPreguntas: this.totalPreguntas()
    });
    
    const porcentaje = (this.puntaje() / (this.totalPreguntas() * 20)) * 100;
    
    if (porcentaje >= 80) {
      await this.alertService.success('¡Excelente!', `Puntaje: ${this.puntaje()}/${this.totalPreguntas() * 20}`);
    } else if (porcentaje >= 50) {
      await this.alertService.info('Bien hecho', `Puntaje: ${this.puntaje()}/${this.totalPreguntas() * 20}`);
    } else {
      await this.alertService.warning('Puedes mejorar', `Puntaje: ${this.puntaje()}/${this.totalPreguntas() * 20}`);
    }
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}