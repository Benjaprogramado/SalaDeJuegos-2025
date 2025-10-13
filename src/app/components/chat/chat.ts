import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  collectionData 
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface Mensaje {
  usuario: string;
  mensaje: string;
  fecha: Date;
  uid?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit {
  mensajes$!: Observable<Mensaje[]>;
  nuevoMensaje = signal('');
  usuario = signal('');
  
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    effect(() => {
      // Auto-scroll cuando hay nuevos mensajes
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.usuario.set(user.email || 'Anónimo');
    this.cargarMensajes();
  }
  
  cargarMensajes() {
    const mensajesCollection = collection(this.firestore, 'chat');
    const q = query(
      mensajesCollection,
      orderBy('fecha', 'asc'),
      limit(50)
    );
    
    this.mensajes$ = collectionData(q, { idField: 'id' }) as Observable<Mensaje[]>;
  }
  
  async enviarMensaje() {
    const mensaje = this.nuevoMensaje().trim();
    if (!mensaje) return;
    
    const nuevoMensajeObj: Mensaje = {
      usuario: this.usuario(),
      mensaje: mensaje,
      fecha: new Date(),
      uid: this.auth.currentUser?.uid
    };
    
    const mensajesCollection = collection(this.firestore, 'chat');
    await addDoc(mensajesCollection, nuevoMensajeObj);
    
    this.nuevoMensaje.set('');
    this.scrollToBottom();
  }
  
  private scrollToBottom() {
    const chatContainer = document.querySelector('.mensajes-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  esMiMensaje(mensaje: Mensaje): boolean {
    return mensaje.uid === this.auth.currentUser?.uid;
  }

  obtenerFecha(fecha: any): Date {
    return fecha?.toDate ? fecha.toDate() : fecha;
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}