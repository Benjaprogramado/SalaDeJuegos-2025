import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const usersGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const user = auth.currentUser;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};