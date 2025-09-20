import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalGraphQL, TypesPersonal } from '../../../interfaces';
import { PersonalService } from '../../../services/personal.service';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-edit-personal',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './edit-personal.component.html',
  styleUrl: '../AgregarPersonal/personal.component.scss'
})
export class EditPersonalComponent implements OnChanges {
  @Input() personalToEdit: PersonalGraphQL | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() personalUpdated = new EventEmitter<any>();

  personalForm: FormGroup;
  isSubmitting = false;

  tiposPersonal: TypesPersonal[] = [];

  constructor(private formBuilder: FormBuilder, private personalService: PersonalService, private alertService: AlertService) {
    this.personalForm = this.formBuilder.group({
      primer_nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),]],
      segundo_nombre: ['', [Validators.maxLength(50)]],
      primer_apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundo_apellido: ['', [Validators.maxLength(50)]],
      tipo_personal: ['', [Validators.required]]
    });
  }

  ngOnChanges(): void {
  if (this.personalToEdit) {
    this.personalForm.patchValue({
      primer_nombre: this.personalToEdit.primer_nombre,
      segundo_nombre: this.personalToEdit.segundo_nombre || '',
      primer_apellido: this.personalToEdit.primer_apellido,
      segundo_apellido: this.personalToEdit.segundo_apellido || '',
      tipo_personal: this.personalToEdit.id_tipo_personal
    });
  }
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
  if (this.personalForm.valid && this.personalToEdit) {
    this.isSubmitting = true;

    const formData = this.personalForm.value;

    const input = {
      id_personal: this.personalToEdit.id_personal,
      primer_nombre: formData.primer_nombre,
      segundo_nombre: formData.segundo_nombre || null,
      primer_apellido: formData.primer_apellido,
      segundo_apellido: formData.segundo_apellido || null,
      id_tipo_personal: Number(formData.tipo_personal),
    };

    this.personalService.updatePersonal(input).subscribe({
      next: (updatedPersonal) => {
        this.alertService.SuccesNotify('Personal actualizado exitosamente.');
        this.personalUpdated.emit(updatedPersonal);
        this.isSubmitting = false;
        this.onCancel();
      },
      error: () => {
        this.alertService.errorReport(
          'Error',
          'Ocurrió un error al actualizar el personal. Intenta de nuevo.'
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
