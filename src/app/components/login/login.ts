import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = signal('');
  password = signal('');
  isLoginMode = signal(true);
  loading = signal(false);

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    this.loading.set(true);
    try {
      await signInWithEmailAndPassword(this.auth, this.email(), this.password());
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Mostrar mensaje de error con SweetAlert2
    } finally {
      this.loading.set(false);
    }
  }

  async register() {
    this.loading.set(true);
    try {
      await createUserWithEmailAndPassword(this.auth, this.email(), this.password());
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al registrarse:', error);
      // Mostrar mensaje de error con SweetAlert2
    } finally {
      this.loading.set(false);
    }
  }

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
  }

  loginRapido(email: string, password: string) {
    this.email.set(email);
    this.password.set(password);
    this.login();
  }
}