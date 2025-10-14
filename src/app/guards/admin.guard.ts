import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AlertService } from '../services/alert';

export const adminGuard = async () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const user = auth.currentUser;

  // Verificar si el usuario está autenticado
  if (!user || !user.email) {
    await alertService.warning('Acceso denegado', 'Debes iniciar sesión');
    router.navigate(['/login']);
    return false;
  }

  try {
    // Verificar si el usuario es administrador
    const userDocRef = doc(firestore, 'users', user.email);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data()['rol'] === 'admin') {
      return true; // Permitir acceso
    } else {
      await alertService.error('Acceso denegado', 'Solo administradores pueden acceder a esta sección');
      router.navigate(['/home']);
      return false;
    }
  } catch (error) {
    console.error('Error al verificar rol:', error);
    await alertService.error('Error', 'No se pudo verificar el rol del usuario');
    router.navigate(['/home']);
    return false;
  }
};