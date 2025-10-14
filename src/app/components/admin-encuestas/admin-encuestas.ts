import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  Firestore, 
  collection, 
  getDocs,
  query,
  orderBy
} from '@angular/fire/firestore';
import { AlertService } from '../../services/alert';

interface RespuestaEncuesta {
  id: string;
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
  selector: 'app-admin-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-encuestas.html',
  styleUrl: './admin-encuestas.css'
})
export class AdminEncuestasComponent implements OnInit {
  respuestas = signal<RespuestaEncuesta[]>([]);
  cargando = signal(true);
  
  constructor(
    private firestore: Firestore,
    private alertService: AlertService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarRespuestas();
  }
  
  async cargarRespuestas() {
    this.cargando.set(true);
    try {
      const encuestasCollection = collection(this.firestore, 'encuestas');
      const q = query(encuestasCollection, orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const respuestas: RespuestaEncuesta[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        respuestas.push({
          id: doc.id,
          ...data,
          fecha: data['fecha']?.toDate() || new Date()
        } as RespuestaEncuesta);
      });
      
      this.respuestas.set(respuestas);
      
      if (respuestas.length === 0) {
        await this.alertService.info('Sin respuestas', 'Aún no hay respuestas de encuestas');
      }
    } catch (error) {
      console.error('Error al cargar respuestas:', error);
      await this.alertService.error('Error', 'No se pudieron cargar las respuestas');
    } finally {
      this.cargando.set(false);
    }
  }
  
  calcularPromedioCalificacion(): number {
    if (this.respuestas().length === 0) return 0;
    const suma = this.respuestas().reduce((acc, r) => acc + r.calificacion, 0);
    return Number((suma / this.respuestas().length).toFixed(1));
  }
  
  juegoMasFavorito(): string {
    if (this.respuestas().length === 0) return 'N/A';
    
    const conteo: { [key: string]: number } = {};
    this.respuestas().forEach(r => {
      conteo[r.juegoFavorito] = (conteo[r.juegoFavorito] || 0) + 1;
    });
    
    return Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);
  }
  
  porcentajeVolveriaJugar(): number {
    if (this.respuestas().length === 0) return 0;
    const positivos = this.respuestas().filter(r => r.volveriaJugar === 'Sí').length;
    return Number(((positivos / this.respuestas().length) * 100).toFixed(1));
  }
  
  porcentajeRecomendaria(): number {
    if (this.respuestas().length === 0) return 0;
    const positivos = this.respuestas().filter(r => r.recomendaria === 'Sí').length;
    return Number(((positivos / this.respuestas().length) * 100).toFixed(1));
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}