import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JuegosService, Resultado } from '../../services/juegos';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class ResultadosComponent implements OnInit {
  resultados = signal<Resultado[]>([]);
  cargando = signal(true);
  filtroJuego = signal('todos');
  
  juegosDisponibles = [
    'todos',
    'Ahorcado',
    'Mayor o Menor',
    'Preguntados',
    'Adivinador de Números'
  ];

  constructor(
    private juegosService: JuegosService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarResultados();
  }
  
  async cargarResultados() {
    this.cargando.set(true);
    try {
      const resultados = await this.juegosService.obtenerResultadosUsuario(20);
      this.resultados.set(resultados);
    } catch (error) {
      console.error('Error al cargar resultados:', error);
    } finally {
      this.cargando.set(false);
    }
  }
  
  resultadosFiltrados(): Resultado[] {
    if (this.filtroJuego() === 'todos') {
      return this.resultados();
    }
    return this.resultados().filter(r => r.juego === this.filtroJuego());
  }
  
  setFiltro(juego: string) {
    this.filtroJuego.set(juego);
  }
  
  calcularPromedio(): number {
    const filtrados = this.resultadosFiltrados();
    if (filtrados.length === 0) return 0;
    
    const suma = filtrados.reduce((acc, r) => acc + r.puntaje, 0);
    return Math.round(suma / filtrados.length);
  }
  
  mejorPuntaje(): number {
    const filtrados = this.resultadosFiltrados();
    if (filtrados.length === 0) return 0;
    
    return Math.max(...filtrados.map(r => r.puntaje));
  }
  
  totalPartidas(): number {
    return this.resultadosFiltrados().length;
  }

  obtenerFecha(fecha: any): Date {
    return fecha?.toDate ? fecha.toDate() : fecha;
  }

  getDetallesTexto(resultado: Resultado): string {
    return resultado.detalles || '';
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}