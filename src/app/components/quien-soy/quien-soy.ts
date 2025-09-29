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
    nombre: "Adivinador de Números",
    descripcion: `
      Un juego donde el jugador debe adivinar un número aleatorio entre 1 y 100.
      El sistema proporciona pistas indicando si el número ingresado es mayor o menor.
      El objetivo es adivinar el número en la menor cantidad de intentos posible.
      Se otorgan puntos basados en la eficiencia: menos intentos = más puntos.
    `,
    instrucciones: [
      "Se genera un número aleatorio del 1 al 100",
      "Tienes máximo 7 intentos para adivinarlo",
      "El sistema te dirá si es mayor o menor", 
      "¡Trata de adivinarlo en la menor cantidad de intentos!"
    ],
    objetivo: "Adivinar el número en el menor tiempo e intentos posible para obtener la máxima puntuación."
  });
}