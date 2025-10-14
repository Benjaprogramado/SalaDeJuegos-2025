import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JuegosService } from '../../../services/juegos';
import { AlertService } from '../../../services/alert';

@Component({
  selector: 'app-adivinador',
  standalone: false,
  templateUrl: './adivinador.html',
  styleUrl: './adivinador.css'
})
export class AdivinadorComponent implements OnInit {
  numeroSecreto = signal(0);
  intentoUsuario = signal<number | null>(null);
  intentos = signal<{numero: number, pista: string}[]>([]);
  intentosRestantes = signal(7);
  juegoTerminado = signal(false);
  gano = signal(false);
  pista = signal('');
  rangoMin = signal(1);
  rangoMax = signal(100);

  constructor(
    private juegosService: JuegosService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.iniciarJuego();
  }
  
  iniciarJuego() {
    this.numeroSecreto.set(Math.floor(Math.random() * 100) + 1);
    this.intentoUsuario.set(null);
    this.intentos.set([]);
    this.intentosRestantes.set(7);
    this.juegoTerminado.set(false);
    this.gano.set(false);
    this.pista.set('¡Adivina el número entre 1 y 100!');
    this.rangoMin.set(1);
    this.rangoMax.set(100);
    
  }
  
  async adivinar() {
    const intento = this.intentoUsuario();
    
    if (intento === null || intento < 1 || intento > 100) {
      await this.alertService.warning('Atención', 'Ingresa un número válido entre 1 y 100');
      return;
    }
    
    this.intentosRestantes.update(i => i - 1);
    
    let pistaNueva = '';
    
    if (intento === this.numeroSecreto()) {
      this.gano.set(true);
      this.juegoTerminado.set(true);
      pistaNueva = '¡CORRECTO!';
      
      const puntaje = this.intentosRestantes() * 10 + 30;
      await this.juegosService.guardarResultado('Adivinador de Números', puntaje, {
        numeroSecreto: this.numeroSecreto(),
        intentosUsados: 7 - this.intentosRestantes()
      });
      
      await this.alertService.success('¡Ganaste!', `Puntaje: ${puntaje} puntos`);
    } else {
      const diferencia = Math.abs(intento - this.numeroSecreto());
      
      if (intento < this.numeroSecreto()) {
        this.rangoMin.set(Math.max(this.rangoMin(), intento + 1));
        pistaNueva = 'El número es MAYOR';
      } else {
        this.rangoMax.set(Math.min(this.rangoMax(), intento - 1));
        pistaNueva = 'El número es MENOR';
      }
      
      // Pistas adicionales según la cercanía
      if (diferencia <= 5) {
        pistaNueva += ' - ¡Estás muy cerca! 🔥';
      } else if (diferencia <= 10) {
        pistaNueva += ' - ¡Estás cerca! 👍';
      } else if (diferencia <= 20) {
        pistaNueva += ' - Tibio... 🤔';
      } else {
        pistaNueva += ' - Frío ❄️';
      }
      
      if (this.intentosRestantes() === 0) {
        this.juegoTerminado.set(true);
        this.gano.set(false);
        pistaNueva = `Perdiste. El número era ${this.numeroSecreto()}`;
        
        await this.juegosService.guardarResultado('Adivinador de Números', 0, {
          numeroSecreto: this.numeroSecreto(),
          intentosUsados: 7
        });
        
        await this.alertService.error('Perdiste', `El número era: ${this.numeroSecreto()}`);
      }
    }
    
    this.pista.set(pistaNueva);
    this.intentos.update(arr => [...arr, {numero: intento, pista: pistaNueva}]);
    this.intentoUsuario.set(null);
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}