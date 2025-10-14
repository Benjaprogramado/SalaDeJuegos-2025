import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { usersGuard } from './guards/users.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    

    { 
      path: 'home', 
      loadComponent: () => import('./components/home/home').then(m => m.Home),
      canActivate: [usersGuard] 
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
        .then(m => m.JuegosModule),
        canActivate: [usersGuard] 
    },
    { 
       path: 'chat', 
       loadComponent: () => import('./components/chat/chat')
         .then(m => m.ChatComponent),
         canActivate: [usersGuard] 
    },
     {path: 'resultados', 
      loadComponent: () => import('./components/resultados/resultados')
        .then(m => m.ResultadosComponent),
        canActivate: [usersGuard] 
    },
     {path: 'encuesta', 
      loadComponent: () => import('./components/encuesta/encuesta')
        .then(m => m.EncuestaComponent),
        canActivate: [usersGuard] 
    },
    {
       path: 'admin/encuestas', 
       loadComponent: () => import('./components/admin-encuestas/admin-encuestas')
         .then(m => m.AdminEncuestasComponent),
       canActivate: [adminGuard] 
    },
     
    { path: '**', redirectTo: '/home' }
];
