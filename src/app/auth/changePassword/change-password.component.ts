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
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
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
      actualPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.passwordsMatchValidator });

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
        return 'La contraseña es requerida';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    return '';
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value || '';
    const confirmPassword = group.get('confirmNewPassword')?.value || '';

    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  passwordsMatch(): boolean {
    const newPass = this.loginForm.get('newPassword')?.value || '';
    const confirmPass = this.loginForm.get('confirmNewPassword')?.value || '';
    return newPass && confirmPass && newPass === confirmPass;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    const id_usuario = user.id_usuario;
    const actualPassword = this.loginForm.get('actualPassword')?.value;
    const newPassword = this.loginForm.get('newPassword')?.value;

    this.isLoading = true;

    this.authService.changePassword(id_usuario, actualPassword, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        Notiflix.Report.success(
          'Contraseña Actualizada',
          'Tu contraseña ha sido cambiada correctamente, inicia sesión de nuevo.',
          'Aceptar'
        );
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.isLoading = false;
        Notiflix.Report.failure('Error', err.message, 'Aceptar');
      }
    });
  }
}

