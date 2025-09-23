import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Rol, UserGraphQL } from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UserComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() userToEdit: UserGraphQL | null = null;
  @Input() modalTitle = 'Agregar Usuario';
  @Input() submitLabel = 'Agregar Usuario';
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSuccess = new EventEmitter<any>();

  userForm: FormGroup;
  isSubmitting = false;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.userForm = this.fb.group({
      nombre_usuario: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      contrasenia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      rol: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  ngOnChanges(): void {
    if (this.userToEdit) {
      this.userForm.patchValue({
        nombre_usuario: this.userToEdit.nombre_usuario,
        rol: this.userToEdit.rol
      });

      this.modalTitle = 'Editar Usuario';
      this.submitLabel = 'Editar Usuario';
    } else {
      this.userForm.reset();
      this.modalTitle = 'Agregar Usuario';
      this.submitLabel = 'Agregar Usuario';
    }
  }

  private loadRoles(): void {
      this.userService.getAllRoles().subscribe({
        next: (data: Rol[]) => this.roles = data,
        error: err => console.error('Error al cargar roles disponibles', err)
      });
    }

  onSubmit(): void {
    if (!this.userForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.userForm.value;

    const input = {
      nombre_usuario: formData.nombre_usuario,
      contrasenia: formData.contrasenia,
      id_rol: Number(formData.id_rol),
      ...(this.userToEdit
        ? { id_usuario: this.userToEdit.id_usuario }
        : { usuario_creacion: this.authService.getCurrentUser()?.id_usuario || 1 })
    };

    const request$ = this.userToEdit
      ? this.userService.updateUser(input)
      : this.userService.createUser(input);

    request$.subscribe({
      next: (result) => {
        this.alertService.SuccesNotify(this.userToEdit ? 'Personal actualizado exitosamente' : 'Personal creado exitosamente');
        this.formSuccess.emit(result);
        this.isSubmitting = false;
        this.onCancel();
      },
      error: () => {
        this.alertService.errorReport(
          'Error',
          this.userToEdit ? 'Error al actualizar el usuario. Intenta de nuevo.' : 'Error al crear el usuario. Intenta de nuevo.'
        );
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  allowLetters(event: KeyboardEvent) {
    const pattern = /[A-Za-zÁÉÍÓÚáéíóúÑñ ]/;
    if (!pattern.test(event.key)) event.preventDefault();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  onCancel(): void {
    this.userForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) this.onCancel();
  }
}
