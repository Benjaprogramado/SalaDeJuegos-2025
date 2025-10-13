import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JuegosService } from '../../../services/juegos';
import { AlertService } from '../../../services/alert';

interface Carta {
  palo: string;
  valor: string;
  valorNumerico: number;
  color: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenorComponent implements OnInit {
  mazo = signal<Carta[]>([]);
  cartaActual = signal<Carta | null>(null);
  siguienteCarta = signal<Carta | null>(null);
  puntaje = signal(0);
  juegoTerminado = signal(false);
  mostrarSiguiente = signal(false);
  acierto = signal(false);

  constructor(
    private juegosService: JuegosService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.iniciarJuego();
  }
  
  iniciarJuego() {
    this.inicializarMazo();
    this.cartaActual.set(this.mazo().pop() || null);
    this.puntaje.set(0);
    this.juegoTerminado.set(false);
    this.mostrarSiguiente.set(false);
  }
  
  inicializarMazo() {
    const palos = [
      { simbolo: '🪙', nombre: 'Oros', color: 'gold' },
      { simbolo: '🍷', nombre: 'Copas', color: 'red' },
      { simbolo: '⚔️', nombre: 'Espadas', color: 'blue' },
      { simbolo: '🏑', nombre: 'Bastos', color: 'green' }
    ];
    const valores = ['1', '2', '3', '4', '5', '6', '7', 'Sota', 'Caballo', 'Rey'];
    
    const nuevoMazo: Carta[] = [];
    for (let paloObj of palos) {
      for (let valor of valores) {
        nuevoMazo.push({
          palo: paloObj.simbolo,
          valor,
          valorNumerico: this.obtenerValorNumerico(valor),
          color: paloObj.color
        });
      }
    }
    
    this.mazo.set(this.shuffleArray(nuevoMazo));
  }
  
  adivinar(esMayor: boolean) {
    if (!this.cartaActual()) return;
    
    const mazoActual = [...this.mazo()];
    const nuevaCarta = mazoActual.pop();
    
    if (!nuevaCarta) {
      this.finalizarJuego();
      return;
    }
    
    this.siguienteCarta.set(nuevaCarta);
    this.mazo.set(mazoActual);
    this.mostrarSiguiente.set(true);
    
    const esCorrecto = esMayor ? 
      nuevaCarta.valorNumerico >= this.cartaActual()!.valorNumerico :
      nuevaCarta.valorNumerico <= this.cartaActual()!.valorNumerico;
    
    if (esCorrecto) {
      this.acierto.set(true);
      this.puntaje.update(p => p + 1);
    } else {
      this.acierto.set(false);
      setTimeout(() => this.finalizarJuego(), 2000);
    }
  }
  
  continuarJuego() {
    this.cartaActual.set(this.siguienteCarta());
    this.siguienteCarta.set(null);
    this.mostrarSiguiente.set(false);
    
    if (this.mazo().length === 0) {
      this.finalizarJuego();
    }
  }
  
  async finalizarJuego() {
    this.juegoTerminado.set(true);
    
    await this.juegosService.guardarResultado('Mayor o Menor', this.puntaje(), {
      cartasAcertadas: this.puntaje()
    });
    
    if (this.puntaje() > 10) {
      await this.alertService.success('¡Excelente!', `Puntaje: ${this.puntaje()}`);
    } else {
      await this.alertService.info('Juego terminado', `Puntaje: ${this.puntaje()}`);
    }
  }
  
  private obtenerValorNumerico(valor: string): number {
    switch (valor) {
      case '1': return 1;
      case 'Sota': return 10;
      case 'Caballo': return 11;
      case 'Rey': return 12;
      default: return parseInt(valor);
    }
  }
  
  private shuffleArray(array: Carta[]): Carta[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}