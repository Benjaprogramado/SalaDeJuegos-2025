import { Injectable, signal } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export interface Resultado {
  usuario: string;
  juego: string;
  puntaje: number;
  fecha: Date;
  detalles?: any;
}

@Injectable({
  providedIn: 'root'
})
export class JuegosService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async guardarResultado(juego: string, puntaje: number, detalles?: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const resultado: Resultado = {
      usuario: user.email || 'Anónimo',
      juego,
      puntaje,
      fecha: new Date(),
      detalles
    };

    const resultadosCollection = collection(this.firestore, 'resultados');
    await addDoc(resultadosCollection, resultado);
  }

  async obtenerResultadosUsuario(cantidadMaxima: number = 10): Promise<Resultado[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    const resultadosCollection = collection(this.firestore, 'resultados');
    const q = query(
      resultadosCollection,
      where('usuario', '==', user.email),
      orderBy('fecha', 'desc'),
      limit(cantidadMaxima)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Resultado);
  }

  async obtenerMejoresPuntajes(juego: string, cantidad: number = 10): Promise<Resultado[]> {
    const resultadosCollection = collection(this.firestore, 'resultados');
    const q = query(
      resultadosCollection,
      where('juego', '==', juego),
      orderBy('puntaje', 'desc'),
      limit(cantidad)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Resultado);
  }
}
