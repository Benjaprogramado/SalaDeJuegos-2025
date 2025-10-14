import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

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
      path: 'juegos', 
      loadChildren: () => import('./components/juegos/juegos.module')
        .then(m => m.JuegosModule)
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
    {
       path: 'admin/encuestas', 
       loadComponent: () => import('./components/admin-encuestas/admin-encuestas')
         .then(m => m.AdminEncuestasComponent),
       canActivate: [adminGuard] 
    },
     
    { path: '**', redirectTo: '/home' }
];
