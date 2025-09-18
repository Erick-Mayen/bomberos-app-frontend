import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TypesPersonal } from '../../../interfaces';
import { PersonalService } from '../../../services/personal.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() personalCreated = new EventEmitter<any>();

  personalForm: FormGroup;
  isSubmitting = false;

  tiposPersonal: TypesPersonal[] = [];

  constructor(private formBuilder: FormBuilder, private personalService: PersonalService,
    private authService: AuthService, private alertService: AlertService) {
    this.personalForm = this.formBuilder.group({
      primer_nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),]],
      segundo_nombre: ['', [Validators.maxLength(50)]],
      primer_apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundo_apellido: ['', [Validators.maxLength(50)]],
      tipo_personal: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTiposPersonal();
  }

  private loadTiposPersonal(): void {
    this.personalService.getAllTypes().subscribe({
      next: (data: TypesPersonal[]) => this.tiposPersonal = data,
      error: err => console.error('Error al cargar tipos de personal', err)
    });
  }

  onSubmit(): void {
  if (this.personalForm.valid) {
    this.isSubmitting = true;

    const formData = this.personalForm.value;
    const currentUser = this.authService.getCurrentUser();
    const input = {
      primer_nombre: formData.primer_nombre,
      segundo_nombre: formData.segundo_nombre || null,
      primer_apellido: formData.primer_apellido,
      segundo_apellido: formData.segundo_apellido || null,
      id_tipo_personal: Number(formData.tipo_personal),
      usuario_creacion: currentUser?.id_usuario || 1
    };

    this.personalService.createPersonal(input).subscribe({
      next: (createdPersonal) => {
        this.alertService.SuccesNotify('Éxito ,Personal creado exitosamente.');

        this.personalCreated.emit(createdPersonal);
        this.personalForm.reset();
        this.isSubmitting = false;
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('Error al crear personal:', err);
        this.alertService.errorReport(
          'Error',
          'Ocurrió un error al crear el personal. Intenta de nuevo.'
        );
        this.isSubmitting = false;
      }
    });
  } else {
    this.markFormGroupTouched();
  }
}

  private markFormGroupTouched(): void {
    Object.keys(this.personalForm.controls).forEach(key => {
      const control = this.personalForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.personalForm.get(fieldName);

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  allowLetters(event: KeyboardEvent) {
  const pattern = /[A-Za-zÁÉÍÓÚáéíóúÑñ ]/;
  if (!pattern.test(event.key)) {
    event.preventDefault();
  }
}

  isFieldInvalid(fieldName: string): boolean {
    const control = this.personalForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  onCancel(): void {
    this.personalForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
