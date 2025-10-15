import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert';
import {LogsService} from '../../services/logs';

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

  constructor(private auth: Auth, private router: Router, private alertService: AlertService, private logsService: LogsService) {}

  async login() {
    this.loading.set(true);
    try {
      await signInWithEmailAndPassword(this.auth, this.email(), this.password());
      await this.logsService.registrarLog(this.email(), 'Login', 'Inicio de sesión exitoso');
      await this.alertService.success('¡Bienvenido!', 'Has iniciado sesión correctamente');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      // Mostrar mensaje de error con SweetAlert2
      this.alertService.error('Error al iniciar sesión', error.message || 'Credenciales incorrectas');
    } finally {
      this.loading.set(false);
    }
  }

  async register() {
    this.loading.set(true);
    try {
      await createUserWithEmailAndPassword(this.auth, this.email(), this.password());
      await this.logsService.registrarLog(this.email(), 'Registro', 'Registro de usuario exitoso');
      await this.alertService.success('¡Bienvenido!', 'Te has registrado correctamente');
      this.router.navigate(['/home']);
    } catch (error: any) {
      // Mostrar mensaje de error con SweetAlert2
      this.alertService.error('Error al registrarse', error.message || 'No se pudo crear la cuenta');
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