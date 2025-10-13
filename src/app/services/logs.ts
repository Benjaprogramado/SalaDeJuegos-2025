import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, limit, getDocs } from '@angular/fire/firestore';

export interface Log {
  usuario: string;
  accion: string;
  fecha: Date;
  detalles?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(private firestore: Firestore) {}

  async registrarLog(usuario: string, accion: string, detalles?: string): Promise<void> {
    const log: Log = {
      usuario,
      accion,
      fecha: new Date(),
      detalles
    };

    const logsCollection = collection(this.firestore, 'logs');
    await addDoc(logsCollection, log);
  }

  async obtenerLogs(cantidadMaxima: number = 50): Promise<Log[]> {
    const logsCollection = collection(this.firestore, 'logs');
    const q = query(
      logsCollection,
      orderBy('fecha', 'desc'),
      limit(cantidadMaxima)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Log);
  }
}