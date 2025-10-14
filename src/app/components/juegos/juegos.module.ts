import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuegosRoutingModule } from './juegos-routing.module';

// Importar todos los componentes
import { AhorcadoComponent } from './ahorcado/ahorcado';
import { MayorMenorComponent } from './mayor-menor/mayor-menor';
import { PreguntadosComponent } from './preguntados/preguntados';
import { AdivinadorComponent } from './adivinador/adivinador';

@NgModule({
  declarations: [
    AhorcadoComponent,
    MayorMenorComponent,
    PreguntadosComponent,
    AdivinadorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // Si tus juegos usan ngModel
    JuegosRoutingModule
  ]
})
export class JuegosModule { }