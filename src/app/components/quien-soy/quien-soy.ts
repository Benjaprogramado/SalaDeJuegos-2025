import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy {
  datosPersonales = signal({
    nombre: "Tu Nombre",
    apellido: "Tu Apellido",
    edad: 25,
    carrera: "Ingeniería en Sistemas"
  });
  
  juegoPropio = signal({
    nombre: "Mi Juego",
    descripcion: "Descripción de tu juego personalizado"
  });

}
