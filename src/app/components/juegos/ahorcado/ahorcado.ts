import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JuegosService } from '../../../services/juegos';
import { AlertService } from '../../../services/alert';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class AhorcadoComponent implements OnInit {
  palabraSecreta = signal('');
  palabraOculta = signal('');
  letrasUsadas = signal<string[]>([]);
  intentosFallidos = signal(0);
  maxIntentos = signal(6);
  juegoTerminado = signal(false);
  gano = signal(false);
  
  abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  
  palabrasDisponibles = [
    'ANGULAR', 'TYPESCRIPT', 'FIREBASE', 'JAVASCRIPT', 'PROGRAMACION',
    'COMPUTADORA', 'UNIVERSIDAD', 'PROYECTO', 'DESARROLLO', 'APLICACION',
    'COMPONENTE', 'SERVICIO', 'ARQUITECTURA', 'FRAMEWORK', 'BIBLIOTECA'
  ];

  constructor(
    private juegosService: JuegosService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.iniciarJuego();
  }
  
  iniciarJuego() {
    const palabraAleatoria = this.palabrasDisponibles[
      Math.floor(Math.random() * this.palabrasDisponibles.length)
    ];
    this.palabraSecreta.set(palabraAleatoria);
    this.palabraOculta.set('_'.repeat(palabraAleatoria.length));
    this.letrasUsadas.set([]);
    this.intentosFallidos.set(0);
    this.juegoTerminado.set(false);
    this.gano.set(false);
  }
  
  seleccionarLetra(letra: string) {
    if (this.letrasUsadas().includes(letra) || this.juegoTerminado()) return;
    
    this.letrasUsadas.update(letras => [...letras, letra]);
    
    if (this.palabraSecreta().includes(letra)) {
      this.revelarLetra(letra);
    } else {
      this.intentosFallidos.update(i => i + 1);
    }
    
    this.verificarFinJuego();
  }
  
  private revelarLetra(letra: string) {
    let nuevaPalabra = '';
    for (let i = 0; i < this.palabraSecreta().length; i++) {
      if (this.palabraSecreta()[i] === letra) {
        nuevaPalabra += letra;
      } else {
        nuevaPalabra += this.palabraOculta()[i];
      }
    }
    this.palabraOculta.set(nuevaPalabra);
  }
  
  private async verificarFinJuego() {
    if (this.palabraOculta() === this.palabraSecreta()) {
      this.juegoTerminado.set(true);
      this.gano.set(true);
      
      const puntaje = 100 - (this.intentosFallidos() * 10);
      await this.juegosService.guardarResultado('Ahorcado', puntaje, {
        palabra: this.palabraSecreta(),
        intentosFallidos: this.intentosFallidos()
      });
      
      await this.alertService.success('¡Ganaste!', `Puntaje: ${puntaje}`);
    } else if (this.intentosFallidos() >= this.maxIntentos()) {
      this.juegoTerminado.set(true);
      this.gano.set(false);
      
      await this.juegosService.guardarResultado('Ahorcado', 0, {
        palabra: this.palabraSecreta(),
        intentosFallidos: this.intentosFallidos()
      });
      
      await this.alertService.error('Perdiste', `La palabra era: ${this.palabraSecreta()}`);
    }
  }

  getAhorcadoDibujo(): string {
    const dibujos = [
      `
   +---+
   |   |
       |
       |
       |
       |
=========`,
      `
   +---+
   |   |
   O   |
       |
       |
       |
=========`,
      `
   +---+
   |   |
   O   |
   |   |
       |
       |
=========`,
      `
   +---+
   |   |
   O   |
  /|   |
       |
       |
=========`,
      `
   +---+
   |   |
   O   |
  /|\\  |
       |
       |
=========`,
      `
   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
=========`,
      `
   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
=========`
    ];
    return dibujos[this.intentosFallidos()] || dibujos[0];
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}