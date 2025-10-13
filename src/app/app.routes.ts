import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    

    { 
      path: 'home', 
      loadComponent: () => import('./components/home/home').then(m => m.Home)
    },
    { 
      path: 'login', 
      loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    { 
      path: 'quien-soy', 
      loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoy)
    },
    
    { 
      path: 'juegos/ahorcado', 
      loadComponent: () => import('./components/juegos/ahorcado/ahorcado')
        .then(m => m.AhorcadoComponent)
    },
     { 
       path: 'juegos/mayor-menor', 
       loadComponent: () => import('./components/juegos/mayor-menor/mayor-menor')
        .then(m => m.MayorMenorComponent)
    },
    { 
       path: 'juegos/preguntados', 
       loadComponent: () => import('./components/juegos/preguntados/preguntados')
         .then(m => m.PreguntadosComponent)
     },
    { 
       path: 'juegos/adivinador', 
       loadComponent: () => import('./components/juegos/adivinador/adivinador')
         .then(m => m.AdivinadorComponent)
     },
     { 
       path: 'chat', 
       loadComponent: () => import('./components/chat/chat')
         .then(m => m.ChatComponent)
     },
     {path: 'resultados', 
      loadComponent: () => import('./components/resultados/resultados')
        .then(m => m.ResultadosComponent)
     },
     {path: 'encuesta', 
      loadComponent: () => import('./components/encuesta/encuesta')
        .then(m => m.EncuestaComponent)
     },
    { path: '**', redirectTo: '/home' }
];
