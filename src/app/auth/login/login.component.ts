import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AuthService } from '../../services/auth.service';
import Notiflix from 'notiflix';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return fieldName === 'usuario' ? 'El Usuario es requerido' : 'La contraseña es requerida';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
      if (field.errors['invalidUsername']) {
        return 'Ingrese un nombre de usuario válido';
      }
    }
    return '';
  }

  usernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasLetter = /[a-zA-Z]/.test(value);

    if (!hasLetter) {
      return { invalidUsername: true };
    }

    return null;
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const { usuario, password } = this.loginForm.value;

    setTimeout(() => {
      this.authService.login(usuario, password).subscribe({
        next: () => {
          this.isLoading = false;
          const currentUser = this.authService.getCurrentUser();

          if (currentUser && currentUser.validar === true) {
            // Redirigir al cambio de contraseña
            this.router.navigateByUrl('/changePassword');
            Notiflix.Report.info(
              'Cambio de Contraseña',
              'Debes cambiar tu contraseña antes de continuar.',
              'Aceptar'
            );
            return;
          }

          const user = currentUser?.personalAsignado?.primer_nombre
            ? `${currentUser.personalAsignado.primer_nombre} ${currentUser.personalAsignado.primer_apellido ?? ''}`.trim()
            : `${currentUser.nombre_usuario}`.trim();

          this.router.navigateByUrl('/app');
          Notiflix.Loading.dots(`¡Bienvenido ${user}!`);
          setTimeout(() => {
            Notiflix.Loading.remove();
          }, 2000);
        },
        error: (err: Error) => {
          this.isLoading = false;

          switch (err.message) {
            case 'TIMEOUT':
              this.errorMessage = 'Error en el servidor. Intenta más tarde.';
              break;

            case 'LOGIN_FALLIDO':
              this.errorMessage = 'Usuario o contraseña incorrectos';
              break;

            case 'SERVER_ERROR':
              this.errorMessage = 'Error en el servidor. Intenta más tarde.';
              break;

            case 'NO_CONNECTION':
              this.errorMessage = 'No tienes conexión a internet';
              break;

            case 'USUARIO_INACTIVO':
              this.errorMessage = 'Tu cuenta no esta activa, contacta al administrador';
              break;

            default:
              this.errorMessage = 'Ocurrió un error inesperado';
              break;
          }
        }
      });
    }, 1000);
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.alertService.infoReport(
      'Recuperar Contraseña',
      'Por favor, contacta al administrador del sistema para recuperar tu contraseña.',
    );
  }
}

