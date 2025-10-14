import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './ahorcado/ahorcado';
import { MayorMenorComponent } from './mayor-menor/mayor-menor';
import { PreguntadosComponent } from './preguntados/preguntados';
import { AdivinadorComponent } from './adivinador/adivinador';

const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'adivinador', component: AdivinadorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }